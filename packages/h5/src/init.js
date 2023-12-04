import Vue from 'vue';
import { installOptions, installFilters, install } from '@vusion/utils';
import * as Vant from '@lcap/mobile-ui';
import { VanToast as Toast } from '@lcap/mobile-ui';

import MEmitter from 'cloud-ui.vusion/src/components/m-emitter.vue';
import MPubSub from 'cloud-ui.vusion/src/components/m-pub-sub.vue';

import './setConfig';
import { filters } from '@lcap/template-core';
import { AuthPlugin, DataTypesPlugin, LogicsPlugin, RouterPlugin, ServicesPlugin, UtilsPlugin } from '@lcap/template-core';
import { filterRoutes, parsePath } from '@lcap/template-core';
import { getBasePath } from '@lcap/template-core';
import { filterAuthResources, findNoAuthView, getTitleGuard, initRouter } from '@lcap/template-core';

import VueI18n from 'vue-i18n';
import App from './App.vue';

import '@/assets/css/index.css';

const fnList = ['afterRouter'];
const evalWrap = function (metaData, fnName) {
    // eslint-disable-next-line no-eval
    metaData && fnName && metaData?.frontendEvents[fnName] && eval(metaData.frontendEvents[fnName]);
};
/* 👇CloudUI中入口逻辑 */
Vue.prototype.$env = Vue.prototype.$env || {};
Vue.prototype.$env.VUE_APP_DESIGNER = String(process.env.VUE_APP_DESIGNER) === 'true';
Vue.prototype.$at2 = function (obj, propertyPath) {
    if (propertyPath === '' && !this.$env.VUE_APP_DESIGNER) return obj;
    return this.$at(obj, propertyPath);
};

function getAsyncPublicPath() {
    const script = document.querySelector('script[src*="cloud-ui.vusion"]');
    if (!script) return;

    const src = script.src;
    const publicPath = src.replace(/\/[^/]+$/, '/');
    // eslint-disable-next-line camelcase, no-undef
    __webpack_public_path__ = publicPath;
}
getAsyncPublicPath();
/* 👆CloudUI中入口逻辑 */

window.appVue = Vue;
window.Vue = Vue;
const CloudUI = {
    install,
    MEmitter,
    MPubSub,
};
// 梳理下来只有install被使用过
window.CloudUI = CloudUI;

// 预览沙箱不需要调用init来初始化，但是需要使用到CloudUI和Vant组件，所以放在外边
installOptions(Vue);
Vue.mixin(MEmitter);
Vue.mixin(MPubSub);
Vue.use(Vant);

// 需要兼容老应用的制品，因此新版本入口函数参数不做改变
const init = (appConfig, platformConfig, routes, metaData) => {
    // 应用初始化之前 不能访问应用中的任何逻辑
    evalWrap.bind(window)(metaData, 'rendered');
    ['preRequest', 'postRequest'].forEach((fnName) => {
        evalWrap.bind(window)(metaData, fnName);
    });
    window.appInfo = Object.assign(appConfig, platformConfig);

    installFilters(Vue, filters);

    // 处理当前语言
    let locale = 'zh-CN';
    if (appConfig.i18nInfo) {
        const { I18nList, messages } = appConfig.i18nInfo;
        locale = getUserLanguage(appConfig, messages);
        // 重置当前生效语言
        appConfig.i18nInfo.locale = locale;
        appConfig.i18nInfo.currentLocale = locale;
        // 设置当前语言名称
        appConfig.i18nInfo.localeName = I18nList?.find((item) => item.id === locale)?.name;
        // 设置当前语言的翻译信息
        window.Vue.prototype.$vantLang = locale;

        window.Vue.prototype.$vantMessages = {
            ...window.Vue.prototype.$vantMessages,
            ...(messages || {}),
        };
    }
    Vue.use(LogicsPlugin, metaData);
    Vue.use(RouterPlugin);
    Vue.use(ServicesPlugin, metaData);
    Vue.use(AuthPlugin, appConfig);
    Vue.use(DataTypesPlugin, { ...metaData, i18nInfo: appConfig.i18nInfo });
    Vue.use(UtilsPlugin, metaData);

    // 已经获取过权限接口
    Vue.prototype.hasLoadedAuth = false;

    // 是否已经登录
    Vue.prototype.logined = true;

    // 全局catch error，主要来处理中止组件,的错误不想暴露给用户，其余的还是在控制台提示出来
    Vue.config.errorHandler = (err, vm, info) => {
        if (err.name === 'Error' && err.message === '程序中止') {
            console.warn('程序中止');
        } else {
            // err，错误对象
            // vm，发生错误的组件实例
            // info，Vue特定的错误信息，例如错误发生的生命周期、错误发生的事件
            console.error(err);
        }
    };
    if (window?.rendered) {
        if (!window?.$toast) {
            // eslint-disable-next-line new-cap
            window.$toast = { show: (message) => Toast({ message, position: top }) };
        }
        window.rendered();
    }
    const baseResourcePaths = platformConfig.baseResourcePaths || [];
    const authResourcePaths = platformConfig.authResourcePaths || [];
    const baseRoutes = filterRoutes(routes, null, (route, ancestorPaths) => {
        const routePath = route.path;
        const completePath = [...ancestorPaths, routePath].join('/');
        let completeRedirectPath = '';
        const redirectPath = route.redirect;
        if (redirectPath) {
            completeRedirectPath = [...ancestorPaths, redirectPath].join('/');
        }
        return baseResourcePaths.includes(completePath) || completeRedirectPath;
    });

    const router = initRouter(baseRoutes);
    const fnName = 'beforeRouter';
    if (fnName && metaData.frontendEvents[fnName]) {
        evalWrap.bind(window)(metaData, fnName);
        Vue.prototype[fnName] = window[fnName];
    }
    const beforeRouter = Vue.prototype.beforeRouter;
    const getAuthGuard = (router, routes, authResourcePaths, appConfig, baseResourcePaths, beforeRouter) => async (to, from, next) => {
        try {
            if (beforeRouter) {
                const event = {
                    baseResourcePaths,
                    router,
                    routes,
                    authResourcePaths,
                    appConfig,
                    beforeRouter,
                    to,
                    from,
                    next,
                    parsePath,
                    getBasePath,
                    filterAuthResources,
                    findNoAuthView,
                    filterRoutes,
                };
                await beforeRouter(event);
            }
        } catch (err) {}
        next();
    };
    beforeRouter && router.beforeEach(getAuthGuard(router, routes, authResourcePaths, appConfig, baseResourcePaths, window.beforeRouter));
    router.beforeEach(getTitleGuard(appConfig));

    const i18nInfo = appConfig.i18nInfo;
    const i18n = new VueI18n({
        locale: locale,
        messages: i18nInfo.messages,
    });
    window.$i18n = i18n;
    const app = new Vue({
        name: 'app',
        router,
        i18n,
        ...App,
    });
    if (metaData && metaData.frontendEvents) {
        for (let index = 0; index < fnList.length; index++) {
            const fnName = fnList[index];
            if (fnName && metaData.frontendEvents[fnName]) {
                evalWrap.bind(app)(metaData, fnName);
                Vue.prototype[fnName] = window[fnName];
            }
        }
    }
    const afterRouter = Vue.prototype.afterRouter;

    afterRouter &&
        router.afterEach(async (to, from, next) => {
            try {
                if (afterRouter) {
                    await afterRouter(to, from);
                }
            } catch (err) {}
        });
    app.$mount('#app');
    return app;
};

function getUserLanguage(appConfig, messages = {}) {
    let locale = localStorage.i18nLocale;
    // 如果local里没有就读主应用的默认语言
    if (!messages[locale]) {
        // 如果当前浏览器的设置也没有，就读取主应用的默认语言
        locale = navigator.language || navigator.userLanguage;

        if (!messages[locale]) {
            // 如果不在列表中，获取语言代码的前两位
            let baseLang = locale.substring(0, 2);
            const languageList = Object.keys(messages);
            // 查找列表中是否有与基础语言代码相同的项
            let match = languageList.find((lang) => lang.startsWith(baseLang));
            // 如果存在前两位一样的就用这个
            if (match) {
                locale = match;
            } else {
                // 如果不存在，就用默认语言
                locale = appConfig.i18nInfo.locale || 'zh-CN';
            }
        }
    }
    return locale;
}
export default {
    init,
};

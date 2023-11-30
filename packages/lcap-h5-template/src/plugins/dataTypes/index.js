import CryptoJS from 'crypto-js';
import cookie from '@lcap/base-core/utils/cookie';
import storage from '@lcap/base-core/utils/storage/localStorage';
import { initApplicationConstructor, genSortedTypeKey, genInitData, isInstanceOf } from '@lcap/base-core/plugins/dataTypes/tools';
import { getBasePath } from '@lcap/base-core/utils/encodeUrl';
import authService from '../auth/authService';
import { porcessPorts } from '../router/processService';
import { navigateToUserInfoPage } from '../common/wx';
import { globalUtils,isLooseEqualFn, resolveRequestData } from '@lcap/base-core/plugins/dataTypes/index';

window.CryptoJS = CryptoJS;

export default {
    install(Vue, options = {}) {
        const dataTypesMap = options.dataTypesMap || {}; // TODO 统一为  dataTypesMap
        const i18nInfo = options.i18nInfo || {};

        initApplicationConstructor(dataTypesMap, Vue);

        const genInitFromSchema = (typeKey, defaultValue, level) => genInitData(typeKey, defaultValue, level);

        /**
         * read datatypes from template, then parse schema
         * @param {*} schema 是前端用的 refSchema
         */
        Vue.prototype.$genInitFromSchema = genInitFromSchema;
        window.$genInitFromSchema = genInitFromSchema;

        const frontendVariables = {};
        const localCacheVariableSet = new Set(); // 本地存储的全局变量集合

        if (Array.isArray(options && options.frontendVariables)) {
            options.frontendVariables.forEach((frontendVariable) => {
                const { name, typeAnnotation, defaultValue, localCache } = frontendVariable;
                localCache && localCacheVariableSet.add(name); // 本地存储的全局变量集合
                frontendVariables[name] = genInitFromSchema(genSortedTypeKey(typeAnnotation), defaultValue);
            });
        }

        const $global = {
            // 用户信息
            userInfo: {},
            // 国际化信息
            i18nInfo: i18nInfo,
            // 前端全局变量
            frontendVariables,
            ...globalUtils,
            hasAuth(authPath) {
                return authService.has(authPath);
            },
            getIsMiniApp() {
                return window.__wxjs_environment === 'miniprogram';
            },
            getWeChatOpenid() {
                return localStorage.getItem('_wx_openid');
            },
            getWeChatHeadImg() {
                return localStorage.getItem('_wx_headimg');
            },
            getWeChatNickName() {
                return localStorage.getItem('_wx_nickname');
            },
            navigateToUserInfo() {
                navigateToUserInfoPage();
            },
            logout() {
                window.vant.VanDialog.confirm({
                    title: '提示',
                    message: '确定退出登录吗?',
                }).then(async () => {
                    try {
                        await authService.logout();
                    } catch (error) {
                        console.warn(error);
                    }

                    storage.set('Authorization', '');
                    // cookie.eraseAll();
                    cookie.erase('authorization');
                    cookie.erase('username');
                    window.location.href = `${getBasePath()}/login`;
                }).catch(() => {
                    // on cancel
                });
            },
            setI18nLocale(newLocale) {
                // 修改local中的存储的语言标识
                localStorage.i18nLocale = newLocale;
                // 修改当前template的语言
                $global.i18nInfo.locale = newLocale;
                $global.i18nInfo.currentLocale = newLocale;
                // 修改当前语言名称
                $global.i18nInfo.localeName = this.getI18nList().find((item) => item.id === newLocale)?.name;
                // 更新当前模板的语言
                appVM.$i18n.locale = newLocale;
                // 调用UI库更新当前语言
                window.Vue.prototype.$vantLang = newLocale;
                // 重新加载页面
                window.location.reload();
            },
            getI18nList() {
                // 在ide中拼接好
                return $global.i18nInfo.I18nList || [];
            },
        };
        Object.keys(porcessPorts).forEach((service) => {
            $global[service] = porcessPorts[service];
        });
        new Vue({
            data: {
                $global,
            },
        });
        // localCacheVariableSet 只是读写并不需要加入到响应式中故 把这个变量挂载到 Vue 的原型上
        Vue.prototype.$localCacheVariableSet = localCacheVariableSet;
        Vue.prototype.$global = $global;
        window.$global = $global;

        Vue.prototype.$isInstanceOf = isInstanceOf;

        // const enumsMap = options.enumsMap || {};
        // function createEnum(items) {
        //     const Enum = (key) => items[key];
        //     Object.assign(Enum, items); // 如果items里含有{name:'**'}，赋值会报错，页面白屏，所以这里屏蔽
        //     return Enum;
        // }
        // Object.keys(enumsMap).forEach((enumKey) => {
        //     enumsMap[enumKey] = createEnum(enumsMap[enumKey] || {});
        // });
        // 判断两个对象是否相等，不需要引用完全一致
        Vue.prototype.$isLooseEqualFn = isLooseEqualFn;

        const enumsMap = options.enumsMap || {};
        Vue.prototype.$enums = (key, value) => {
            if (!key || !value) return '';
            if (enumsMap[key]) {
                return enumsMap[key][value];
            } else {
                return '';
            }
        };
        Vue.prototype.$resolveRequestData = resolveRequestData;
    },
};

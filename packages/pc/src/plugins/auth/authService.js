import Vue from 'vue';
import { authInitService, lowauthInitService  } from '@lcap/template-core';
import cookie from '@lcap/template-core';

const getBaseHeaders = () => {
    const headers = {
        Env: window.appInfo && window.appInfo.env,
    };
    if (cookie.get('authorization')) {
        headers.Authorization = cookie.get('authorization');
    }
    return headers;
};

let userInfoPromise = null;
let userResourcesPromise = null;

export default {
    _map: undefined,
    getUserInfo() {
        if (!userInfoPromise) {
            if (window.appInfo.hasUserCenter) {
                userInfoPromise = lowauthInitService.GetUser({
                    headers: getBaseHeaders(),
                    config: {
                        noErrorTip: true,
                    },
                });
            } else {
                userInfoPromise = authInitService.GetUser({
                    headers: getBaseHeaders(),
                    config: {
                        noErrorTip: true,
                    },
                });
            }
            userInfoPromise = userInfoPromise.then((result) => {
                const userInfo = result?.Data;
                if (!userInfo?.UserId && userInfo?.userId) {
                    userInfo.UserId = userInfo.userId;
                    userInfo.UserName = userInfo.userName;
                }
                const $global = Vue.prototype.$global || {};
                const frontendVariables = Vue.prototype.$global.frontendVariables || {};
                frontendVariables.userInfo = userInfo;
                $global.userInfo = userInfo;
                return userInfo;
            }).catch((e) => {
                userInfoPromise = null;
                throw e;
            });
        }
        return userInfoPromise;
    },
    getUserResources(DomainName) {
        if (window.appInfo.hasAuth) {
            userResourcesPromise = lowauthInitService.GetUserResources({
                headers: getBaseHeaders(),
                query: {
                    userId: Vue.prototype.$global.userInfo.UserId,
                    userName: Vue.prototype.$global.userInfo.UserName,
                },
                config: {
                    noErrorTip: true,
                },
            }).then((result) => {
                let resources = [];
                // 初始化权限项
                this._map = new Map();
                if (Array.isArray(result)) {
                    resources = result.filter((resource) => resource?.resourceType === 'ui');
                    resources.forEach((resource) => this._map.set(resource.resourceValue, resource));
                }
                return resources;
            });
        } else {
            // 这个是非下沉应用，调用的是Nuims的接口，此处需非常注意Resource大小写情况，开发时需关注相关测试用例是否覆盖
            userResourcesPromise = authInitService.GetUserResources({
                headers: getBaseHeaders(),
                query: {
                    DomainName,
                },
                config: {
                    noErrorTip: true,
                },
            }).then((res) => {
                this._map = new Map();
                const resources = res.Data.items.reduce((acc, { ResourceType, ResourceValue, ...item }) => {
                    if (ResourceType === 'ui') {
                        acc.push({ ...item, ResourceType, ResourceValue, resourceType: ResourceType, resourceValue: ResourceValue }); // 兼容大小写写法，留存大写，避免影响其他隐藏逻辑
                    }
                    return acc;
                }, []);
                // 初始化权限项
                resources.forEach((resource) => this._map.set(resource?.ResourceValue, resource));
                return resources;
            });
        }
        return userResourcesPromise;
    }
}   
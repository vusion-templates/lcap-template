import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import { 
    setConfig, 
    genInitFromSchema, genSortedTypeKey
} from '@lcap/core-template';
import { destination } from './plugins/router';
import pluginsAuthService from './plugins/auth/authService';
import $globalUtils from './plugins/dataTypes/index'
import routerProcessService from './plugins/router/processService'
import { getTitleGuard } from './router/guards/title'

import { UToast } from 'cloud-ui.vusion';

function setFrontendVariables(options) {
    const frontendVariables = {};
    const localCacheVariableSet = new Set();
    if (Array.isArray(options && options.frontendVariables)) {
        options.frontendVariables.forEach((frontendVariable) => {
            const { name, typeAnnotation, defaultValueFn, defaultCode, localCache } = frontendVariable;
            localCache && localCacheVariableSet.add(name); // 本地存储的全局变量集合
            let defaultValue = defaultCode?.code;
            if (Object.prototype.toString.call(defaultValueFn) === '[object Function]') {
                defaultValue = defaultValueFn(Vue);
            }
            frontendVariables[name] = genInitFromSchema(genSortedTypeKey(typeAnnotation), defaultValue);
        });
    }
    return {
        frontendVariables,
        localCacheVariableSet
    }
}
// 设置core config
setConfig({
    pluginsAuthService: {
        ...pluginsAuthService
    },
    Toast: {
        show: UToast?.show,
        error: UToast?.error
    },
    $global: {
        ...$globalUtils
    },
    getFrontendVariables: (options) => {
        return {
            frontendVariables: setFrontendVariables(options)?.frontendVariables,
            localCacheVariableSet: setFrontendVariables(options)?.localCacheVariableSet,
        };
    },
    destination,
    routerProcessService: {
       ...routerProcessService
    },
    createRouter: (routes) =>  {
        new VueRouter({
            mode: 'history',
            base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
            routes,
        })
    },
    getTitleGuard,
    utils: {
        axiosInterceptors: () => {
            axios.interceptors.response.use(
                function (response) {
                  if (response.headers.authorization) {
                    response.data.authorization = response.headers.authorization;
                  }
                  return response;
                  // eslint-disable-next-line prefer-arrow-callback
                },
                function (error) {
                  return Promise.reject(error);
                }
              );
        },
        decodeDownloadName: (effectiveFileName) => {
           effectiveFileName = decodeURIComponent(effectiveFileName);
        },
        downloadUrlDiff: (data, status, statusText) => {
            // 如果没有size长度
            if (data && data.size === 0) {
                return Promise.resolve({
                    data: {
                        code: status,
                        msg: statusText,
                    },
                });
            }
        }
    }
});

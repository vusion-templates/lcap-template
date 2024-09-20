import Vue from 'vue';
import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes';
import { destination } from './plugins/router';
import { createRouter } from './router';

// 设置core config
setConfig({
    Toast: {
        show:
            Vue.prototype?.$toast?.show ||
            (() => {
                console.warn('请在Vue.prototype上挂载$toast.show方法');
            }),
        error:
            Vue.prototype?.$toast?.error ||
            (() => {
                console.warn('请在Vue.prototype上挂载$toast.error方法');
            }),
    },
    setGlobal,
    getFrontendVariables,
    destination,
    createRouter,
    utils: {},
    configureRequest(options, axios) {
        axios.interceptors.response.use(
            function onSuccess(response) {
                if (response.headers.authorization) {
                    response.data.authorization = response.headers.authorization;
                }
                return response;
            },
            function onError(error) {
                return Promise.reject(error);
            }
        );

        /**
         * options配置参考
         * https://axios-http.com/zh/docs/req_config
         */

        // 修改请求baseURL
        // options.baseURL = 'https://some-domain.com/api';

        // 增加额外的请求头
        // options.headers = {
        //     ...(options.headers || {}),
        //     key1: 'value1',
        // }

        // 增加额外的请求参数（带在请求链接上）
        // options.params = {
        //     ...(options.params || {}),
        //     key2: 'value2',
        // };

        // 增加额外的请求参数（带在请求体上）
        // options.data = {
        //     ...(options.data || {}),
        //     key3: 'value3',
        // }
    },
});

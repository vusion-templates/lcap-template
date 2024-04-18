import Vue from 'vue';
import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes/index';
import { destination } from './plugins/router';
import { createRouter } from './router';

import SToast from '@/components/s-toast.vue';
const Ctr = Vue.component('s-toast', SToast);
const $toast = new Ctr();

// if (!window?.$toast) {
//     window.$toast = window.Vue.prototype.$toast;
// }

// 设置core config
setConfig({
    Toast: {
        show: $toast?.show,
        error: $toast?.show,
    },
    setGlobal,
    getFrontendVariables,
    destination,
    createRouter,
    utils: {
        decodeDownloadName: (effectiveFileName) => {
            return decodeURIComponent(effectiveFileName);
        },
    },

    configureRequest(options) {
        /**
         * options配置参考
         * https://axios-http.com/zh/docs/req_config
         */

        // 修改请求baseURL
        // options.baseURL = 'https://some-domain.com/api';
        // 增加额外的请求头
        // options.headers['key1'] = 'value1';
        // options.headers['key2'] = 'value2';
        // 增加额外的请求参数（get请求）
        // options.params['key1'] = 'value1';
        // options.params['key2'] = 'value2';
        // 增加额外的请求参数（post请求）
        // options.data['key1'] = 'value1';
        // options.data['key2'] = 'value2';
    },
});

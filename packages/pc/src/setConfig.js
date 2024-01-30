import Vue from 'vue';
import { setConfig } from '@lcap/core-template';
import { UToast } from 'cloud-ui.vusion';
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
        error: UToast?.error,
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
});

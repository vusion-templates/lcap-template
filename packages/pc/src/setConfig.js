import Vue from 'vue';
import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes/index';
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
    utils: {
        decodeDownloadName: (effectiveFileName) => {
            return decodeURIComponent(effectiveFileName);
        },
    },
});

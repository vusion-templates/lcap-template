import VueRouter from 'vue-router';
import { setConfig } from '@lcap/core-template';

import { $globalUtils, getFrontendVariables, setGlobal } from './plugins/dataTypes/index';
import { destination } from './plugins/router';
import { getTitleGuard } from './router/guards/title';

import { UToast } from 'cloud-ui.vusion';

// 设置core config
setConfig({
    Toast: {
        show: UToast?.show,
        error: UToast?.error,
    },
    setGlobal,
    getFrontendVariables,
    destination,
    createRouter: (routes) => {
        return new VueRouter({
            mode: 'history',
            base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
            routes,
        });
    },
    getTitleGuard,
    utils: {
        decodeDownloadName: (effectiveFileName) => {
            return decodeURIComponent(effectiveFileName);
        },
    },
});

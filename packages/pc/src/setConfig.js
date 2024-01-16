import VueRouter from 'vue-router';
import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes/index';
import { destination } from './plugins/router';
import { createRouter } from './router';
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
    createRouter,
    utils: {
        decodeDownloadName: (effectiveFileName) => {
            return decodeURIComponent(effectiveFileName);
        },
    },
});

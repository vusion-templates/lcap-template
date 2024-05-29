import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes/index';
import { destination } from './plugins/router';
import { createRouter } from './router';

// 从当前组件库调用Toast
const UI = window.UILibray || {};
const toast = UI.Toast || {
    show: () => {},
    error: () => {},
};

// 设置core config
setConfig({
    Toast: {
        show: toast?.show,
        error: toast?.error,
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

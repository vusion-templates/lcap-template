import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes';
import { destination } from './plugins/router';
import { createRouter } from './router';

// 从当前组件库调用Toast
const UI = window.LCAPUILibrary || {};
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
        axiosInterceptors: [
            {
                onSuccess(response) {
                    if (response.headers.authorization) {
                        response.data.authorization = response.headers.authorization;
                    }
                    return response;
                },
                onError(error) {
                    return Promise.reject(error);
                },
            },
        ],
    },
});

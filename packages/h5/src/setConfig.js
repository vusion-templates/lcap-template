import Vue from 'vue';
import { setConfig } from '@lcap/core-template';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes';
import { destination } from './plugins/router';
import { createRouter } from './router';

// 设置core config
setConfig({
    toast: {
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
    router: {
        destination,
        createRouter,
    },
    axios: {
        interceptors: [
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
        ]
    }
});

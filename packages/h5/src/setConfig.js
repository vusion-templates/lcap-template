import { setConfig } from '@lcap/core-template';
import { VanToast as Toast } from '@lcap/mobile-ui';

import { getFrontendVariables, setGlobal } from './plugins/dataTypes';
import { destination } from './plugins/router';
import { createRouter } from './router';

if (!window?.$toast) {
    // eslint-disable-next-line new-cap
    window.$toast = {
        show: (message) => Toast({ message, position: top }),
        error: (message) => Toast.fail({ message, position: top }),
    };
}

// 设置core config
setConfig({
    setGlobal,
    getFrontendVariables,
    destination,
    createRouter,
    Toast: {
        show: (message, stack) =>
            Toast({
                message,
                position: 'top',
            }),
        error: (message, stack) =>
            Toast.fail({
                message,
                position: 'top',
            }),
    },
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

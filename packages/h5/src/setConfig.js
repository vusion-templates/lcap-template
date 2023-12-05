import { setConfig } from '@lcap/core-template';
import { VanToast as Toast } from '@lcap/mobile-ui';

import { getFrontendVariables, $global } from './plugins/dataTypes';
import { destination } from './plugins/router';
import { createRouter, getTitleGuard } from './router';

// 设置core config
setConfig({
    $global,
    getFrontendVariables,
    destination,
    createRouter,
    getTitleGuard,
    Toast: {
        show: (message, stack) => {
            Toast({
                message,
                position: 'top',
            });
        },
        error: (message, stack) => {
            Toast.fail({
                message,
                position: 'top',
            });
        },
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

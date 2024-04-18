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
    utils: {},
    configureRequest(options, axios) {
        axios.interceptors.response.use(
            function onSuccess(response) {
                if (response.headers.authorization) {
                    response.data.authorization = response.headers.authorization;
                }
                return response;
            },
            function onError(error) {
                return Promise.reject(error);
            }
        );

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

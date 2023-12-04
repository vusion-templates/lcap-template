import { setConfig } from '@lcap/template-core';

import { destination } from './plugins/router';

// 设置core config
setConfig({
    $global: {

    },
    Toast: {
        show: (message, stack) => void 0,
        error: (message, stack) => void 0,
    },
    getFrontendVariables: () => {
        return {
            frontendVariables: {},
            localCacheVariableSet: new Set(),
        };
    },
    destination,
    createRouter: (routes) => void 0,
    getTitleGuard: (appConfig) => (to, from, next) => void 0,
});

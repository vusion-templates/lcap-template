import '@lcap/mobile-ui/dist-theme/index.css';

import metaData from './metaData.json';
import platformConfig from './platform.config.json';
import { routes } from '@lcap/base-core/router/routes';
import cloudAdminDesigner from './init';

import { setConfig } from '@lcap/base-core';

// 设置core config
setConfig({
    $global: {},
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
    destination: () => void 0,
    createRouter: (routes) => void 0,
    getTitleGuard: (appConfig) => (to, from, next) => void 0,
});
cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

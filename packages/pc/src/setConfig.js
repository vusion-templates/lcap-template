import VueRouter from 'vue-router';
import { 
    setConfig
} from '@lcap/core-template';
import { destination } from './plugins/router';
import pluginsAuthService from './plugins/auth/authService';
import { $global, setFrontendVariables } from './plugins/dataTypes/index'
import routerProcessService from './plugins/router/processService'
import { getTitleGuard } from './router/guards/title'

import { UToast } from 'cloud-ui.vusion';
import utils from './utils/index'

// 设置core config
setConfig({
    frontendFlag: 'PC',
    pluginsAuthService: {
        ...pluginsAuthService
    },
    Toast: {
        show: UToast?.show,
        error: UToast?.error
    },
    $global: {
        ...$global
    },
    getFrontendVariables: (options) => {
        return {
            frontendVariables: setFrontendVariables(options)?.frontendVariables,
            localCacheVariableSet: setFrontendVariables(options)?.localCacheVariableSet,
        };
    },
    destination,
    routerProcessService: {
       ...routerProcessService
    },
    createRouter: (routes) =>  {
        new VueRouter({
            mode: 'history',
            base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
            routes,
        })
    },
    getTitleGuard,
    utils: {
        ...utils
    }
});

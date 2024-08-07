import Vue from 'vue';
import VueRouter from 'vue-router';

import Config from '../config'

export function initRouter(routes) {
    Vue.use(VueRouter);

    const router = Config.router.createRouter({ routes, VueRouter });
    
    return router;
}


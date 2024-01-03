export function createRouter({ routes, VueRouter }) {
    const router = new VueRouter({
        mode: 'history',
        base: window.LcapMicro?.routePrefix || process.env.BASE_URL,
        routes,
    });

    router.afterEach((to, from) => {
        const saveList = ['_wx_openid', '_wx_headimg', '_wx_nickname'];
        if (to.query)
            for (const i in to.query) {
                if (saveList.includes(i)) {
                    window.localStorage.setItem(i, to.query[i]);
                }
            }
    });
    return router;
}

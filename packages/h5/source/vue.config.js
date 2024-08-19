const path = require('path');

module.exports = {
    configureWebpack(config) {
        config.resolve.alias['cloud-ui.vusion$'] = path.resolve(__dirname, 'node_modules/cloud-ui.vusion/dist-theme/index.js');
        config.resolve.alias['cloud-ui.vusion.css$'] = path.resolve(__dirname, 'node_modules/cloud-ui.vusion/dist-theme/index.css');

        if (process.env.NODE_ENV === 'production') {
            config.devtool = false;
        }
    },
    lintOnSave: false,
    runtimeCompiler: true,
    devServer: {
        port: 8810,
        proxy: {
            '/assets': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '/rest': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '^/gateway/': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '^/gw/': {
                target: `http://localhost:8080`,
                changeOrigin: true,
                autoRewrite: true,
            },
        },
    },
};

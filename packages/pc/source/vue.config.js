// 修改该文件时，需要同步修改 source/icestark/vue.config.js 和 source/qiankun/vue.config.js
const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@lcap/pc-ui$': path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.js'),
                '@lcap/pc-ui/css$': path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.css'),
            },
        },
    },
    lintOnSave: false,
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
            '^/upload': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
        },
    },
};

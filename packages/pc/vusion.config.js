const path = require('path');

module.exports = {
    type: 'app',
    designer: true,
    staticPath: './src/static',
    srcPath: './src',
    libraryPath: './src/global',
    baseCSSPath: './src/global/styles/index.css',
    theme: './src/global/styles/theme.css',
    alias: {
        vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
        'vue-i18n$': path.resolve(__dirname, 'node_modules/vue-i18n/dist/vue-i18n.esm.js'),
        'vue-router$': path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.esm.js'),
        '@': path.resolve(__dirname, 'src'),
        '@lcap/pc-ui$': path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.js'),
        '@lcap/pc-ui/css$': path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.css'),
    },
};

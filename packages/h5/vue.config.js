const path = require('path');
const pkg = require('./package.json');

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackOptimization = require('./webpack/optimization');
const EsbuildPlugin = require('./webpack/esbuild-plugin');

const vueConfig = {
    publicPath: '/',
    outputDir: 'public',
    assetsDir: 'public',
    productionSourceMap: true,
    transpileDependencies: [/lodash/, 'resize-detector'],
    chainWebpack(config) {
        config.externals({
            ...config.get('externals'),
        });
        config.module.rule('js').uses.delete('cache-loader');

        webpackOptimization.chain(config, isDevelopment);
        if (config.plugins.has('css-sprite-plugin')) {
            config.plugin('css-sprite-plugin').tap(([opts]) => {
                opts.filename = '[name].[hash:16].[ext]';
                return [opts];
            });
        }
    },
    configureWebpack: (config) => {
        config.output.libraryExport = 'default';
        config.output.jsonpFunction = 'webpackJsonp' + pkg.name;
        // 使用esbuild压缩
        config.optimization.minimizer = [new EsbuildPlugin({
            target: 'es2015',
        })];
    },
};

module.exports = vueConfig;

const { EsbuildPlugin } = require('esbuild-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const pkg = require('./package.json');

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackOptimization = require('./webpack/optimization');

const vueConfig = {
    publicPath: '/',
    outputDir: 'public',
    assetsDir: 'public',
    productionSourceMap: false,
    transpileDependencies: [/lodash/, 'resize-detector'],
    chainWebpack(config) {
        config.externals({
            ...config.get('externals'),
            '@lcap/mobile-ui': 'vant',
        });
        config.resolve.alias.set('cloud-ui.vusion.css$', path.resolve(__dirname, '../node_modules/cloud-ui.vusion/dist-raw/index.css'));
        config.module.rule('js').uses.delete('cache-loader');

        config.plugin('copy-cloud-ui-chunks').use(CopyWebpackPlugin, [
            [
                {
                    context: 'node_modules/cloud-ui.vusion/dist-raw',
                    from: 'chunk-*',
                    to: 'public/js/',
                },
            ],
        ]);

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
        config.optimization.minimizer = [new EsbuildPlugin()];
    },
};

module.exports = vueConfig;

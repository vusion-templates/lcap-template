const { EsbuildPlugin } = require('esbuild-loader');
const pkg = require('./package.json');
const argv = require('minimist')(process.argv.slice(2));
const isDevelopment = process.env.NODE_ENV === 'development';
const publicPathPrefix = process.env.SITE_TYPE === 'gh-pages' ? `https://vusion-templates.github.io/${pkg.name}` : '/';

const port = argv.port || 8810;

const devServer = require('./webpack.dev-server')(port);

const webpackDll = require('./webpack/dll');
const webpackCloudUI = require('./webpack/cloud-ui');
const webpackStyle = require('./webpack/style');
const webpackDesigner = require('./webpack/designer');
const webpackRoutes = require('./webpack/routes');
const webpackHtml = require('./webpack/html');
const webpackOptimization = require('./webpack/optimization');
const isDesigner = process.env.BUILD_LIB_ENV === 'designer';

const baseConfig = {
    publicPath: publicPathPrefix,
    outputDir: 'public',
    assetsDir: 'public',
    productionSourceMap: false,
    transpileDependencies: [/lodash/, 'resize-detector', /cloud-ui\.vusion/, /@cloud-ui/],
};

const vueConfig = {
    ...baseConfig,
    chainWebpack(config) {
        if (isDesigner) {
            webpackDesigner.chain(config);
        } else {
            webpackHtml.chain(config, isDevelopment);
            webpackDll.chain(config, publicPathPrefix, isDevelopment);
        }
        webpackOptimization.chain(config, isDevelopment);
        // config.resolve.alias
        // .set('@lcap/core-template', path.resolve(__dirname, '../base-core'))

        webpackCloudUI.chain(config);
        webpackStyle.chain(config);
        webpackRoutes.chain(config);
        config.output.jsonpFunction('webpackJsonp' + pkg.name);

        config.module.rule('js').uses.delete('cache-loader');
    },
    configureWebpack: (config) => {
        if (isDesigner) {
            webpackDesigner.config(config);
        }
        // 使用esbuild压缩
        config.optimization.minimizer = [
            new EsbuildPlugin({
                target: 'es2015',
            }),
        ];
    },
    devServer,
};

module.exports = vueConfig;

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    chain(config) {
        config.plugin('copy-cloud-ui-chunks').use(CopyWebpackPlugin, [[{
            context: 'node_modules/@lcap/pc-ui/dist-theme',
            from: 'chunk-*',
            to: 'public/js/',
        }]]);
    },
};

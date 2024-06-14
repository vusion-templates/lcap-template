const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');

const root = path.resolve(__dirname, '..');

module.exports = merge(config, {
    devtool: 'eval',
    devServer: {
        port: 8000,
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(root, 'index.html'),
        }),
    ],
});

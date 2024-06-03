const path = require('path');
const fs = require('fs-extra');
module.exports = {
    config(config) {
        config.output.libraryExport = 'default';
    },
    chain(config) {
        config.externals({
            ...config.get('externals'),
            '@lcap/pc-ui': 'CloudUI',
        });
        config.resolve.alias.set('@lcap/pc-ui/css$', path.resolve(__dirname, './index.css'));
    },
};

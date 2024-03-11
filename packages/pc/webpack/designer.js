const path = require('path');
const fs = require('fs-extra');
module.exports = {
    config(config) {
        config.output.libraryExport = 'default';
    },
    chain(config) {
        config.externals({
            ...config.get('externals'),
            'cloud-ui.vusion': 'CloudUI',
        });
        config.resolve.alias.set('cloud-ui.vusion.css$', path.resolve(__dirname, './index.css'));
    },
};

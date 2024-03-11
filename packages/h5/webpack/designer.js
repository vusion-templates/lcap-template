const path = require('path');
const fs = require('fs-extra');
module.exports = {
    config(config, pages) {
        Object.keys(pages).forEach((pageName) => {
            delete pages[pageName];
        });

        config.output.libraryExport = 'default';
    },
    chain(config) {
        config.externals({
            ...config.get('externals'),
            '@lcap/mobile-ui': 'vant',
        });
    },
};

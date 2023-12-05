module.exports = {
    moduleFileExtensions: [
        'vue', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node',
    ],
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^cloud-ui.vusion.css$': '<rootDir>/node_modules/cloud-ui.vusion/dist-raw/index.css',
        '^cloud-ui.vusion$': '<rootDir>/node_modules/cloud-ui.vusion/dist-raw/index.js',
        '^@lcap/mobile-ui$': '<rootDir>/node_modules/@lcap/mobile-ui/dist-theme/index.js',
        '^@lcap/mobile-ui$': '<rootDir>/__mocks__/lcap-mobile-ui.js',
    },
    snapshotSerializers: [
        'jest-serializer-vue',
    ],
    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],
    testURL: 'http://localhost/',
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};
// 设置测试运行的时区
process.env.TZ = 'Asia/Shanghai';

module.exports = {
    moduleFileExtensions: [
        'vue', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node',
    ],
    preset: 'ts-jest',
    transform: {
        '^.+\\.vue$': 'vue-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    },
    transformIgnorePatterns: [
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^cloud-ui.vusion.css$': '<rootDir>/node_modules/cloud-ui.vusion/dist-raw/index.css',
        '^cloud-ui.vusion$': '<rootDir>/node_modules/cloud-ui.vusion/dist-raw/index.js',
    },
    snapshotSerializers: [
        'jest-serializer-vue',
    ],
    testMatch: [
        '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
        '**/tests/unit/**/*.test.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};

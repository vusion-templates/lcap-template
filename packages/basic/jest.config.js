// 设置测试运行的时区
process.env.TZ = 'Asia/Shanghai';

module.exports = {
    moduleFileExtensions: [
        'ts', 
        'js', 
        'json',
    ],
    preset: 'ts-jest',
    transform: {
      "\\.[jt]s$": "ts-jest"
    },
    transformIgnorePatterns: [
        '/node_modules/',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],
};

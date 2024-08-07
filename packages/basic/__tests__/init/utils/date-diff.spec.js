"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('日期插值 DateDiff', function () {
    test('DateDiff 按月', function () {
        expect(utils_1.utils.DateDiff('2023-01-31', '2023-04-05', 'M')).toBe(2);
    });
    test('DateDiff 按日', function () {
        expect(utils_1.utils.DateDiff('2022-12-31', '2023-01-01', 'd')).toBe(1);
    });
    test('DateDiff 按日', function () {
        expect(utils_1.utils.DateDiff('2022-12-31 00:00:01', '2023-01-01 00:00:00', 'd')).toBe(0);
    });
    test('DateDiff 按日', function () {
        expect(utils_1.utils.DateDiff('2022-12-31 00:00:01', '2023-01-01 00:00:01', 'd')).toBe(1);
    });
});

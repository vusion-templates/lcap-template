"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('Split 函数', function () {
    test('Split 函数 保留末尾空串', function () {
        expect(utils_1.utils.Split('1.', '.', true))
            .toEqual(['1', '']);
        expect(utils_1.utils.Split('1..', '.', true))
            .toEqual(['1', '', '']);
        expect(utils_1.utils.Split('1', '.', true))
            .toEqual(['1']);
    });
    test('Split 函数 舍弃末尾空串', function () {
        expect(utils_1.utils.Split('1.', '.', false))
            .toEqual(['1']);
        expect(utils_1.utils.Split('1..', '.', false))
            .toEqual(['1', '']);
        expect(utils_1.utils.Split('1', '.', false))
            .toEqual(['1']);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fast_check_1 = __importDefault(require("fast-check"));
var utils_1 = require("@/init/utils");
describe('Test List Contains', function () {
    test('测试非正常输入', function () {
        expect(utils_1.utils.Contains(undefined, 1)).toBe(false);
        expect(utils_1.utils.Contains(null, 1)).toBe(false);
        expect(utils_1.utils.Contains([], 1)).toBe(false);
        expect(utils_1.utils.Contains([undefined, null], 1)).toBe(false);
    });
    test('正常输入', function () {
        var list = [1, 4, null, -2, null, undefined];
        expect(utils_1.utils.Contains(list, 1)).toBe(true);
        expect(utils_1.utils.Contains(list, 4)).toBe(true);
        expect(utils_1.utils.Contains(list, -2)).toBe(true);
        expect(utils_1.utils.Contains(list, 3)).toBe(false);
        expect(utils_1.utils.Contains(list, null)).toBe(true);
        expect(utils_1.utils.Contains(list, undefined)).toBe(true);
    });
    test('正常输入 字符串', function () {
        var list = ['1', '4', null, '-2', null, undefined];
        expect(utils_1.utils.Contains(list, '1')).toBe(true);
        expect(utils_1.utils.Contains(list, '4')).toBe(true);
        expect(utils_1.utils.Contains(list, '-2')).toBe(true);
        expect(utils_1.utils.Contains(list, '3')).toBe(false);
        expect(utils_1.utils.Contains(list, null)).toBe(true);
        expect(utils_1.utils.Contains(list, undefined)).toBe(true);
    });
});
describe('ListContains property-based check', function () {
    it('ListContains 总是包含 0 号元素和最后一个元素', function () {
        fast_check_1.default.assert(fast_check_1.default.property(fast_check_1.default.array(fast_check_1.default.integer(), { minLength: 1 }), function (list) {
            return utils_1.utils.Contains(list, list[0]) && utils_1.utils.Contains(list, list[list.length - 1]);
        }));
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('FormatNumber 函数', function () {
    test('FormatNumber', function () {
        expect(utils_1.utils.FormatNumber('1.005', 2, false, false, false, false)).toBe('1.01');
        expect(utils_1.utils.FormatNumber('1.00', 2, true, false, false, false)).toBe('1');
        expect(utils_1.utils.FormatNumber('1.001005', 3, true, false, false, false)).toBe('1.001');
        expect(utils_1.utils.FormatNumber('1.001005', 4, true, false, false, false)).toBe('1.001');
        expect(utils_1.utils.FormatNumber('1.001005', 4, false, false, false, false)).toBe('1.0010');
    });
});

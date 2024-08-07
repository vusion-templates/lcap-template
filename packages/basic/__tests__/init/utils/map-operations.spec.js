"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('Map 测试', function () {
    test('MapGet MapPut', function () {
        {
            var testMap = {};
            utils_1.utils.MapPut(testMap, 1.0, '123');
            utils_1.utils.MapPut(testMap, 1.00, '456');
            expect(utils_1.utils.Length(testMap)).toBe(1);
            expect(utils_1.utils.MapGet(testMap, 1)).toBe('456');
        }
    });
});

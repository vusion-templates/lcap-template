"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('List arithmetic (aggregation) functions', function () {
    var fns = [utils_1.utils.ListMax, utils_1.utils.ListMin, utils_1.utils.ListSum, utils_1.utils.ListProduct, utils_1.utils.ListAverage];
    test('测试非正常输入', function () {
        fns.forEach(function (fn) {
            expect(fn(undefined)).toBeNull;
        });
        fns.forEach(function (fn) {
            expect(fn(null)).toBeNull;
        });
        fns.forEach(function (fn) {
            expect(fn([])).toBeNull;
        });
        fns.forEach(function (fn) {
            expect(fn([undefined, null, null])).toBeNull;
        });
    });
    test('测试正常输入', function () {
        {
            var list = [1, 4, null, -2, null];
            expect(utils_1.utils.ListMax(list)).toBe(4);
            expect(utils_1.utils.ListMin(list)).toBe(-2);
            expect(utils_1.utils.ListAverage(list)).toBe(1);
            expect(utils_1.utils.ListProduct(list)).toBe(-8);
            expect(utils_1.utils.ListSum(list)).toBe(3);
        }
        {
            var list = [1, 4, null, -2, null];
            expect(utils_1.utils.ListMax(list)).toBe(4);
            expect(utils_1.utils.ListMin(list)).toBe(-2);
            expect(utils_1.utils.ListAverage(list)).toBe(1);
            expect(utils_1.utils.ListProduct(list)).toBe(-8);
            expect(utils_1.utils.ListSum(list)).toBe(3);
        }
        {
            var list = ['123', 'abc', 'abb'];
            expect(utils_1.utils.ListMax(list)).toBe('abc');
            expect(utils_1.utils.ListMin(list)).toBe('123');
        }
        {
            var list = ['111', 'aa', 'ab'];
            expect(utils_1.utils.ListMax(list)).toBe('ab');
            expect(utils_1.utils.ListMin(list)).toBe('111');
        }
    });
    test('测试数值精度', function () {
        var list = [undefined, 0.8, 1.2, null, null];
        expect(utils_1.utils.ListSum(list)).toBe(2.0);
        expect(utils_1.utils.ListProduct(list)).toBe(0.96);
        expect(utils_1.utils.ListAverage(list)).toBe(1.0);
        var list2 = ['1.2', '2.4', '6.4'];
        expect(utils_1.utils.ListSum(list2)).toBe(10.0);
    });
    test('QA 给的用例', function () {
        expect(utils_1.utils.ListMax([-1.1, null, null, -2.2])).toBe(-1.1);
        expect(utils_1.utils.ListAverage([null, 1.5, 2.5, 3.5])).toBe(2.5);
        expect(utils_1.utils.ListAverage([-1.1, null, null, -2.2])).toBe(-1.65);
        expect(utils_1.utils.ListProduct([-1.1, null, null, -2.2])).toBe(2.42);
        expect(utils_1.utils.ListAverage([0.2, 0.2, 0.2, null, null])).toBe(0.2);
    });
});

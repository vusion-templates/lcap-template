"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('测试所有列表函数的边界输入场景', function () {
    var fns = [utils_1.utils.Concat, utils_1.utils.Join, utils_1.utils.Length, utils_1.utils.Get, utils_1.utils.Set, utils_1.utils.Contains, utils_1.utils.Add, utils_1.utils.AddAll, utils_1.utils.Insert, utils_1.utils.Remove,
        utils_1.utils.RemoveAt,
        utils_1.utils.ListAverage, utils_1.utils.ListDistinct, utils_1.utils.ListDistinctBy, utils_1.utils.ListFilter, utils_1.utils.ListFind,
        utils_1.utils.ListFindIndex, utils_1.utils.ListFlatten, utils_1.utils.ListGroupBy, utils_1.utils.ListHead, utils_1.utils.ListLast, utils_1.utils.ListMax, utils_1.utils.ListMin,
        utils_1.utils.ListProduct, utils_1.utils.ListReverse, utils_1.utils.ListSlice, utils_1.utils.ListSliceToPageOf, utils_1.utils.ListSort, utils_1.utils.ListSum,
        utils_1.utils.ListToMap, utils_1.utils.ListTransform];
    test('测试 undefined 和 null 输入', function () {
        fns.forEach(function (fn) {
            try {
                expect(fn(undefined)).toBeNull;
            }
            catch (err) {
                expect(function () { return fn(undefined); }).toThrow;
            }
        });
        fns.forEach(function (fn) {
            try {
                expect(fn(null)).toBeNull;
            }
            catch (err) {
                expect(function () { return fn(null); }).toThrow;
            }
        });
    });
    test('测试空数组输入', function () {
        fns.forEach(function (fn) {
            try {
                expect(fn([])).toBeNull;
            }
            catch (err) {
                expect(function () { return fn([]); }).toThrow;
            }
        });
    });
    test('测试无效数组元素', function () {
        var __fns = fns.filter(function (fn) { return fn !== utils_1.utils.ListDistinctBy && fn !== utils_1.utils.ListTransform; });
        __fns.forEach(function (fn) {
            try {
                expect(fn([undefined, null, null])).toBeNull;
            }
            catch (err) {
                expect(function () { return fn([undefined, null, null]); }).toThrow();
            }
        });
    });
});

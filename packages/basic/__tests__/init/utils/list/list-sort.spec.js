"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var fast_check_1 = __importDefault(require("fast-check"));
var utils_1 = require("@/init/utils");
describe('List sort functions', function () {
    test('List sort integers', function () {
        // 测试点 1，升序
        {
            var ansAsc = [-100, -100, 0, 0, 0, 100, 100];
            var testArr1 = [-100, 0, 100, 0, 0, 100, -100];
            var testArr1SortedAsc = utils_1.utils.ListSort(testArr1, function (item) { return item; }, true);
            expect(JSON.stringify(ansAsc)).toEqual(JSON.stringify(testArr1));
            expect(testArr1SortedAsc).toBeUndefined;
        }
        // 测试点 2，降序
        {
            var ansDes = [100, 100, 0, 0, 0, -100, -100];
            var testArr2 = [-100, 0, 100, 0, 0, 100, -100];
            var testArr2SortedDes = utils_1.utils.ListSort(testArr2, function (item) { return item; }, false);
            expect(JSON.stringify(ansDes)).toEqual(JSON.stringify(testArr2));
            expect(testArr2SortedDes).toBeUndefined;
        }
    });
    test('List sort integers', function () {
        // 测试点 3，升序
        var obj1 = { name: "Zhang San", gender: "M" };
        var obj2 = { name: "Li Si", gender: "M" };
        var obj3 = { name: "Wang Wu", gender: "F" };
        // name 升序
        var ansAsc = [obj2, obj3, obj1];
        var testArr1 = [obj1, obj2, obj3];
        utils_1.utils.ListSort(testArr1, function (item) { return item.name; }, true);
        expect(JSON.stringify(ansAsc)).toEqual(JSON.stringify(testArr1));
    });
});
describe('ListSort property-based check', function () {
    it('List sort 幂等性', function () {
        fast_check_1.default.assert(fast_check_1.default.property(fast_check_1.default.array(fast_check_1.default.integer()), function (arr) {
            var arrCopy = JSON.parse(JSON.stringify(arr));
            return (0, isEqual_1.default)(utils_1.utils.ListSort(arr), utils_1.utils.ListSort(utils_1.utils.ListSort(arrCopy)));
        }));
    });
    it('ListSort 升序最小值等于 0 号元素', function () {
        fast_check_1.default.assert(fast_check_1.default.property(fast_check_1.default.array(fast_check_1.default.integer(), { minLength: 1 }), function (arr) {
            utils_1.utils.ListSort(arr, function (item) { return item; }, true);
            return utils_1.utils.ListMin(arr) === arr[0];
        }));
    });
    it('ListSort 降序最大值等于 0 号元素', function () {
        fast_check_1.default.assert(fast_check_1.default.property(fast_check_1.default.array(fast_check_1.default.integer(), { minLength: 1 }), function (arr) {
            utils_1.utils.ListSort(arr, function (item) { return item; }, false);
            return utils_1.utils.ListMax(arr) === arr[0];
        }));
    });
});

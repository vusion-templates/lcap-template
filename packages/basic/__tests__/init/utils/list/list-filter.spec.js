"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('ListFilter', function () {
    test('兼容性测试，原生数字', function () {
        {
            var ansAsc = [100, 100];
            var testArr1 = [-100, 0, 100, 0, 0, 100, -100];
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item > 50; }));
        }
    });
    test('数值包装类', function () {
        {
            var ansAsc = [100, 100];
            var testArr1 = [-100, 0, 100, 0, 0, 100, -100];
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item > 50; }));
        }
        {
            var ansAsc = [100, 100.00];
            var testArr1 = [-100.0, 0.0, 100, 0.00, 0.0, 100.00, -100.0];
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item > 50; }));
        }
    });
    test('数值包装类 2', function () {
        var obj1 = { name: "Zhang San", gender: "M", age: 19 };
        var obj2 = { name: "Li Si", gender: "M", age: 20 };
        var obj3 = { name: "Wang Wu", gender: "F", age: 19 };
        {
            var ansAsc = [obj1, obj2];
            var testArr1 = [obj1, obj2, obj3];
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item.gender === 'M'; }));
        }
        {
            var ansAsc = [obj2];
            var testArr1 = [obj1, obj2, obj3];
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item.age > 19; }));
            expect(ansAsc).toEqual(utils_1.utils.ListFilter(testArr1, function (item) { return item.age > 19; }));
        }
    });
});

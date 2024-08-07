"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('ListDistinct', function () {
    test('兼容性测试，去重原生数字', function () {
        {
            var ansAsc = [-100, 0, 100];
            var testArr1 = [-100, 0, 100, 0, 0, 100, -100];
            utils_1.utils.ListDistinct(testArr1);
            expect(ansAsc).toEqual(testArr1);
        }
    });
    test('去重复杂对象', function () {
        var obj1 = { name: "Zhang San", gender: "M", age: 18 };
        var obj2 = { name: "Li Si", gender: "M", age: 20 };
        var obj3 = { name: "Wang Wu", gender: "F", age: 19 };
        // name 升序
        var ansAsc = [obj1, obj2, obj3];
        // TODO：目前只支持按 Reference 内存地址去重
        var testArr1 = [obj1, obj2, obj3, obj2];
        utils_1.utils.ListDistinct(testArr1);
        expect(ansAsc).toEqual(testArr1);
    });
    test('去重字符串', function () {
        {
            var ansAsc = ['abc', 'ab'];
            var testArr1 = ['abc', 'ab', 'abc'];
            utils_1.utils.ListDistinct(testArr1);
            expect(ansAsc).toEqual(testArr1);
        }
    });
});
describe('ListDistinctBy', function () {
    test('兼容性测试，去重原生数字', function () {
        {
            var ansAsc = [-100, 0, 100];
            var testArr1 = [-100, 0, 100, 0, 0, 100, -100];
            expect(ansAsc).toEqual(utils_1.utils.ListDistinctBy(testArr1, [function (item) { return item; }]));
        }
    });
    test('去重复杂对象', function () {
        var obj1 = { name: "Zhang San", gender: "M", age: 19 };
        var obj2 = { name: "Li Si", gender: "M", age: 20 };
        var obj3 = { name: "Wang Wu", gender: "F", age: 19 };
        {
            var ansAsc = [obj1, obj3];
            var testArr1 = [obj1, obj2, obj3];
            expect(ansAsc).toEqual(utils_1.utils.ListDistinctBy(testArr1, [function (item) { return item.gender; }]));
        }
        {
            var ansAsc = [obj1, obj2];
            var testArr1 = [obj1, obj2, obj3];
            expect(ansAsc).toEqual(utils_1.utils.ListDistinctBy(testArr1, [function (item) { return item.age; }]));
        }
    });
});

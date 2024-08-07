"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('Convert 函数', function () {
    test('Convert 函数，string 到 string', function () {
    });
    test('Convert 函数，string 到 Integer', function () {
        expect(utils_1.utils.Convert('123.4', { typeKind: 'primitive', typeName: 'Long' }))
            .toBe(123);
        expect(utils_1.utils.Convert('1234.5', { typeKind: 'primitive', typeName: 'Long' }))
            .toBe(1235);
    });
    test('Convert 函数，string 到 Decimal', function () {
        expect(utils_1.utils.Convert('123.4', { typeKind: 'primitive', typeName: 'Decimal' }))
            .toBe(123.4);
        expect(utils_1.utils.Convert('1.01', { typeKind: 'primitive', typeName: 'Decimal' }))
            .toBe(1.01);
    });
    //     test('Convert 函数，string 到 DateTime', () => {
    //         const str = '2019-09-09 11:00:00';
    //         expect(codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'DateTime' }))
    //             .toBe('2019-09-09T11:00:00+08:00');
    //         expect(codewaveUtils.ToString('nasl.core.DateTime',
    //                 codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'DateTime' })))
    //             .toBe('2019-09-09 11:00:00');
    //     });
    //     test('Convert 函数，string 到 Date', () => {
    //         const str = '2019-09-09 11:00:00';
    //         expect(codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'Date' }))
    //             .toBe('2019-09-09');
    //         expect(codewaveUtils.ToString('nasl.core.Date',
    //                 codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'Date' })))
    //             .toBe('2019-09-09');
    //     });
    //     test('Convert 函数，string 到 Time', () => {
    //         const str = '2019-09-09 11:00:00';
    //         expect(codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'Time' }))
    //             .toBe('11:00:00');
    //         expect(codewaveUtils.ToString('nasl.core.Time',
    //                 codewaveUtils.Convert(str, { typeKind: 'primitive', typeName: 'Time' })))
    //             .toBe('11:00:00');
    //     });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
describe('日期时间格式化辅助函数', function () {
    test('convertJSDateInTargetTimeZone', function () {
        var dateStr1 = '2000-10-10 10:11:12';
        var dateStr2 = '2000-10-10 10:11:12.123';
        var dateStr3 = '2000/10/10 10:11:12';
        var dateStr4 = '2000/10/10 10:11:12.123';
        var curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        expect(['Invalid Date', 'Invalid time value', 'invalid date'].includes((0, utils_1.convertJSDateInTargetTimeZone)(dateStr1, curTZ).toString())).toBe(false);
        expect(['Invalid Date', 'Invalid time value', 'invalid date'].includes((0, utils_1.convertJSDateInTargetTimeZone)(dateStr2, curTZ).toString())).toBe(false);
        expect(['Invalid Date', 'Invalid time value', 'invalid date'].includes((0, utils_1.convertJSDateInTargetTimeZone)(dateStr3, curTZ).toString())).toBe(false);
        expect(['Invalid Date', 'Invalid time value', 'invalid date'].includes((0, utils_1.convertJSDateInTargetTimeZone)(dateStr4, curTZ).toString())).toBe(false);
    });
});

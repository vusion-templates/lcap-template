"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
var momentTZ = require('moment-timezone');
var moment = require('moment');
describe('当前日期时间系列函数', function () {
    test('CurrentDateTime', function () {
        // -11:00
        var aDateTime = utils_1.utils.FormatDateTime(utils_1.utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Midway');
        // +14:00
        var bDateTime = utils_1.utils.FormatDateTime(utils_1.utils.CurrDateTime('noUse'), 'yyyy-MM-dd HH:mm:ss', 'Pacific/Kiritimati');
        expect(utils_1.utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h', false)).toBe(-25);
        expect(utils_1.utils.DateDiff(new Date(bDateTime), new Date(aDateTime), 'h')).toBe(25);
        var utcDate = momentTZ.tz(new Date(), 'UTC');
        var cDate = utils_1.utils.CurrDateTime('noUse');
        if (utcDate.hours() > 10) {
            // 可能跨月：-30, -29, -28, -27
            expect([1, -30, -29, -28]).toContain(momentTZ.tz(cDate, 'Pacific/Kiritimati').date() - utcDate.date());
        }
        else {
            // 可能跨月
            expect([-1, 30, 29, 28, 27]).toContain(momentTZ.tz(cDate, 'Pacific/Midway').date() - utcDate.date());
        }
    });
    test('CurrentDate', function () {
        // - 11:00
        var aDate = utils_1.utils.CurrDate('Pacific/Midway');
        var a = momentTZ.tz(aDate, 'YYYY-MM-DD', 'Pacific/Midway').date();
        // +14:00
        var bDate = utils_1.utils.CurrDate('Pacific/Kiritimati');
        var b = momentTZ.tz(bDate, 'YYYY-MM-DD', 'Pacific/Kiritimati').date();
        if (b - a > 0) {
            expect([2, 1]).toContain(b - a);
        }
        else {
            // 跨月后是负数
            expect([-27, -28, -29, -30]).toContain(b - a);
        }
    });
    test('CurrentTime', function () {
        var nycTime = utils_1.utils.CurrTime('Etc/GMT+4');
        var a = momentTZ.tz(nycTime, 'HH:mm:ss', 'Etc/GMT+4').hours();
        var shTime = utils_1.utils.CurrTime('Asia/Shanghai');
        var b = momentTZ.tz(shTime, 'HH:mm:ss', 'Asia/Shanghai').hours();
        var utcTime = utils_1.utils.CurrTime('UTC');
        var c = momentTZ.tz(utcTime, 'HH:mm:ss', 'UTC').hours();
        expect([12, -12]).toContain(b - a);
        expect([8, -16]).toContain(b - c);
        expect([4, -20]).toContain(c - a);
    });
});

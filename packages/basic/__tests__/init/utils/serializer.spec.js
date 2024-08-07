"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@/init/utils");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
describe('序列化函数', function () {
    test('JSON 序列化兼容性测试，无时区', function () {
        var cur = new Date('2023-09-21T09:01:56.000Z');
        // 零时区的现有展示方式
        expect(utils_1.utils.JsonSerialize(cur, 'UTC')).toBe('"2023-09-21T09:01:56.000Z"');
        // 未来，想用 "+00:00" 展示零时区
        expect(utils_1.utils.JsonSerialize(cur, 'Etc/GMT')).toBe('"2023-09-21T09:01:56.000+00:00"');
    });
    test('JSON 序列化兼容性测试，无时区 2，字符串输入', function () {
        var cur = '2023-09-21T09:01:56Z';
        // 零时区的现有展示方式
        expect(utils_1.utils.JsonSerialize(cur, 'UTC')).toBe('"2023-09-21T09:01:56.000Z"');
        // 未来，想用 "+00:00" 展示零时区
        expect(utils_1.utils.JsonSerialize(cur, 'Etc/GMT')).toBe('"2023-09-21T09:01:56.000+00:00"');
    });
    test('JSON 序列化测试，有时区', function () {
        {
            var summerTime1 = new Date('2016-03-13T07:00:01.000Z');
            expect(utils_1.utils.JsonSerialize(summerTime1, 'America/New_York'))
                .toBe('"2016-03-13T03:00:01.000-04:00"');
            expect(utils_1.utils.JsonSerialize(summerTime1, 'Asia/Shanghai'))
                .toBe('"2016-03-13T15:00:01.000+08:00"');
        }
        {
            var noSummerTime1 = new Date('2016-03-13T06:59:59.000Z');
            expect(utils_1.utils.JsonSerialize(noSummerTime1, 'America/New_York'))
                .toBe('"2016-03-13T01:59:59.000-05:00"');
            expect(utils_1.utils.JsonSerialize(noSummerTime1, 'Asia/Shanghai'))
                .toBe('"2016-03-13T14:59:59.000+08:00"');
        }
    });
    test('JSON 序列化测试，有时区 2，字符串输入', function () {
        {
            var summerTime1 = '2016-03-13T07:00:01.000Z';
            expect(utils_1.utils.JsonSerialize(summerTime1, 'America/New_York'))
                .toBe('"2016-03-13T03:00:01.000-04:00"');
            expect(utils_1.utils.JsonSerialize(summerTime1, 'Asia/Shanghai'))
                .toBe('"2016-03-13T15:00:01.000+08:00"');
        }
        {
            var noSummerTime1 = '2016-03-13T06:59:59Z';
            expect(utils_1.utils.JsonSerialize(noSummerTime1, 'America/New_York'))
                .toBe('"2016-03-13T01:59:59.000-05:00"');
            expect(utils_1.utils.JsonSerialize(noSummerTime1, 'Asia/Shanghai'))
                .toBe('"2016-03-13T14:59:59.000+08:00"');
        }
    });
    test('ToString 兼容性测试', function () {
        var curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var cur = new Date('2023-09-21T17:01:56+08:00');
        expect(utils_1.utils.ToString('nasl.core.DateTime', cur))
            .toBe(moment_timezone_1.default.tz('2023-09-21T17:01:56+08:00', curTZ).format('YYYY-MM-DD HH:mm:ss'));
    });
    test('ToString 兼容性测试 2，字符串输入', function () {
        var curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var cur = '2023-09-21T17:01:56+08:00';
        expect(utils_1.utils.ToString('nasl.core.DateTime', cur))
            .toBe(moment_timezone_1.default.tz('2023-09-21T17:01:56+08:00', curTZ).format('YYYY-MM-DD HH:mm:ss'));
    });
    test('ToString 时区格式化测试', function () {
        {
            var summerTime1 = new Date('2016-03-13T07:00:01Z');
            expect(utils_1.utils.ToString('nasl.core.DateTime', summerTime1, 'America/New_York'))
                .toBe('2016-03-13 03:00:01');
            expect(utils_1.utils.ToString('nasl.core.DateTime', summerTime1, 'Asia/Shanghai'))
                .toBe('2016-03-13 15:00:01');
        }
        {
            var noSummerTime1 = new Date('2016-03-13T06:59:59Z');
            expect(utils_1.utils.ToString('nasl.core.DateTime', noSummerTime1, 'America/New_York'))
                .toBe('2016-03-13 01:59:59');
            expect(utils_1.utils.ToString('nasl.core.DateTime', noSummerTime1, 'Asia/Shanghai'))
                .toBe('2016-03-13 14:59:59');
        }
        {
            expect(utils_1.utils.ToString('nasl.core.Time', '01:59:59'))
                .toBe('01:59:59');
            expect(utils_1.utils.ToString('nasl.core.Time', '14:59:59'))
                .toBe('14:59:59');
        }
        {
            expect(utils_1.utils.ToString('nasl.core.Time', '2016-03-13 01:59:59'))
                .toBe('01:59:59');
            expect(utils_1.utils.ToString('nasl.core.Time', '2016-03-13 14:59:59'))
                .toBe('14:59:59');
        }
    });
    test('ToString 时区格式化测试 2，字符串输入', function () {
        {
            var summerTime1 = '2016-03-13T07:00:01Z';
            expect(utils_1.utils.ToString('nasl.core.DateTime', summerTime1, 'America/New_York'))
                .toBe('2016-03-13 03:00:01');
            expect(utils_1.utils.ToString('nasl.core.DateTime', summerTime1, 'Asia/Shanghai'))
                .toBe('2016-03-13 15:00:01');
        }
        {
            var noSummerTime1 = '2016-03-13T06:59:59Z';
            expect(utils_1.utils.ToString('nasl.core.DateTime', noSummerTime1, 'America/New_York'))
                .toBe('2016-03-13 01:59:59');
            expect(utils_1.utils.ToString('nasl.core.DateTime', noSummerTime1, 'Asia/Shanghai'))
                .toBe('2016-03-13 14:59:59');
        }
    });
});

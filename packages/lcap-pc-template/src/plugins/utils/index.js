import {
    addDays, subDays, addMonths, formatRFC3339, isValid,
    differenceInYears,
    differenceInQuarters,
    differenceInMonths,
    differenceInWeeks,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
    getDayOfYear, getWeekOfMonth, getQuarter, startOfWeek, getMonth, getWeek, getDate, startOfQuarter,
    addSeconds, addMinutes, addHours, addQuarters, addYears, addWeeks,
    eachDayOfInterval, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { fromString, toastAndThrowError } from '../dataTypes/tools';
import { getAppTimezone, isValidTimezoneIANAString } from '@lcap/base-core/plugins/utils/index'
import { naslDateToLocalDate,  convertJSDateInTargetTimeZone } from '@lcap/base-core/plugins/utils/helper'
import { toValue, baseUtils } from '@lcap/base-core/plugins/utils/index'

const moment = require('moment');

function isArrayOutBounds(arr, index) {
    if (!Array.isArray(arr))
       throw toastAndThrowError('传入内容不是数组');
    if (typeof index !== 'number' || isNaN(index)) {
       throw toastAndThrowError('传入下标不是数字');
    }
    // 传入要找的下标，大于数组长度
    if ((index + 1) > arr.length) {
       throw toastAndThrowError(`列表访问越界，访问下标 ${index}，列表长度 ${arr.length}`);
    }
    return true;
}

let enumsMap = {}
export const utils = {
    ...baseUtils,
    Get(arr, index) {
        if (isArrayOutBounds(arr, index)) {
            return arr[index];
        }
    },
    Set(arr, index, item) {
        if (isArrayOutBounds(arr, index)) {
            return utils.Vue.set(arr, index, item);
        }
    },
    Insert(arr, index, item) {
        if (isArrayOutBounds(arr, index)) {
            arr.splice(index, 0, item);
        }
    },
    RemoveAt(arr, index) {
        if (isArrayOutBounds(arr, index)) {
            return arr.splice(index, 1)[0];
        }
    },
    ListSlice(arr, start, end) {
        // 由于 slice 的特性，end 要校验的是长度，而不是下标，所以要减 1
        if (isArrayOutBounds(arr, start) && isArrayOutBounds(arr, end - 1)) {
            return arr.slice(start, end);
        }
    },
    AddDays(date = new Date(), amount = 1, converter = 'json') {
        return toValue(addDays(new Date(date), amount), converter);
    },
    AddMonths(date = new Date(), amount = 1, converter = 'json') {
        /** 传入的值为标准的时间格式 */
        return toValue(addMonths(new Date(date), amount), converter);
    },
    SubDays(date = new Date(), amount = 1, converter = 'json') {
        return toValue(subDays(new Date(date), amount), converter);
    },
    GetDateCount(dateStr, metric, tz) {
        let date;
        if (this.isInputValidNaslDateTime(dateStr) && !tz) {
            // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
            // v3.4 新应用，使用默认时区时选项，tz 为空
            date = convertJSDateInTargetTimeZone(dateStr, getAppTimezone('global'));
        } else if (this.isInputValidNaslDateTime(dateStr) && tz) {
            // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
            date = convertJSDateInTargetTimeZone(dateStr, tz);
        } else {
            // 针对 nasl.Date 类型
            date = naslDateToLocalDate(dateStr);
        }

        const [metric1, metric2] = metric.split('-');
        // 获取当年的最后一天的所在周会返回1，需要额外判断一下
        function getCurrentWeek(value) {
            let count = getWeek(value, { weekStartsOn: 1 });
            if (value.getMonth() + 1 === 12 && count === 1) {
                count = getWeek(addDays(value, -7), { weekStartsOn: 1 }) + 1;
            }
            return count;
        }
        switch (metric1) {
            case 'day':
                switch (metric2) {
                    case 'week': return differenceInDays(date, startOfWeek(date, { weekStartsOn: 1 })) + 1;
                    case 'month': return getDate(date);
                    case 'quarter': return differenceInDays(date, startOfQuarter(date)) + 1;
                    case 'year': return getDayOfYear(date);
                }
            case 'week':
                switch (metric2) {
                    case 'month': return getWeekOfMonth(date);
                    case 'quarter': return getCurrentWeek(date) - getWeek(startOfQuarter(date)) + 1;
                    case 'year': return getCurrentWeek(date);
                }
            case 'month':
                switch (metric2) {
                    case 'quarter': return getMonth(date) + 1 - (getQuarter(date) - 1) * 3;
                    case 'year': return getMonth(date) + 1;
                }
            case 'quarter':
                return getQuarter(date);
            default:
                return null;
        }
    },
    AlterDateTime(datetring, option, count, unit) {
        const date = new Date(datetring);
        const amount = option === 'Increase' ? count : -count;
        let addDate;
        switch (unit) {
            case 'second': addDate = addSeconds(date, amount); break;
            case 'minute': addDate = addMinutes(date, amount); break;
            case 'hour': addDate = addHours(date, amount); break;
            case 'day': addDate = addDays(date, amount); break;
            case 'week': addDate = addWeeks(date, amount); break;
            case 'month': addDate = addMonths(date, amount); break;
            case 'quarter': addDate = addQuarters(date, amount); break;
            case 'year': addDate = addYears(date, amount); break;
        }
        if (typeof datetring === 'object' || datetring.includes('T')) {
            return moment(addDate).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return moment(addDate).format('YYYY-MM-DD');
        }
    },
    GetSpecificDaysOfWeek(startdatetr, enddatetr, arr, tz) {
        if (!startdatetr)
            toastAndThrowError(`内置函数GetSpecificDaysOfWeek入参错误：startDate不能为空`);
        if (!enddatetr)
            toastAndThrowError(`内置函数GetSpecificDaysOfWeek入参错误：endDate不能为空`);
        if (!Array.isArray(arr)) {
            toastAndThrowError(`内置函数GetSpecificDaysOfWeek入参错误：参数“指定”非合法数组`);
        }

        let startDate;
        let endDate;
        if (this.isInputValidNaslDateTime(startdatetr) && !tz) {
            // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
            // v3.4 新应用，使用默认时区时选项，tz 为空
            startDate = convertJSDateInTargetTimeZone(startdatetr, getAppTimezone('global'));
            endDate = convertJSDateInTargetTimeZone(enddatetr, getAppTimezone('global'));
        } else if (this.isInputValidNaslDateTime(startdatetr) && tz) {
            // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
            startDate = convertJSDateInTargetTimeZone(startdatetr, getAppTimezone(tz));
            endDate = convertJSDateInTargetTimeZone(enddatetr, getAppTimezone(tz));
        } else {
            // 针对 nasl.Date 类型
            startDate = naslDateToLocalDate(startdatetr);
            endDate = naslDateToLocalDate(enddatetr);
        }
        if (startDate > endDate) {
            return [];
        }

        const fns = [isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday];
        const dateInRange = eachDayOfInterval({ start: startDate, end: endDate });
        arr = arr.map((item) => Number(item));
        const isDays = fns.filter((_, index) => arr.includes((index + 1)));
        const filtereddate = dateInRange.filter((day) => isDays.some((fn) => fn(day)));
        if (typeof startdatetr === 'object' || startdatetr.includes('T')) {
            return filtereddate.map((date) => moment(date).format('YYYY-MM-DD HH:mm:ss'));
        } else {
            return filtereddate.map((date) => moment(date).format('YYYY-MM-DD'));
        }
    },
    Convert(value, typeAnnotation) {
        if (typeAnnotation && typeAnnotation.typeKind === 'primitive') {
            if (typeAnnotation.typeName === 'DateTime') {
                return formatRFC3339(new Date(value));
            } else if (typeAnnotation.typeName === 'Date')
                return moment(new Date(value)).format('YYYY-MM-DD');
            else if (typeAnnotation.typeName === 'Time') {
                if (/^\d{2}:\d{2}:\d{2}$/.test(value)) // 纯时间 12:30:00
                    return moment(new Date('2022-01-01 ' + value)).format('HH:mm:ss');
                else
                    return moment(new Date(value)).format('HH:mm:ss');
            } else if (typeAnnotation.typeName === 'String')
                return String(value);
            else if (typeAnnotation.typeName === 'Double' || typeAnnotation.typeName === 'Decimal') // 小数 或者精确小数
                return parseFloat(+value);
            else if (typeAnnotation.typeName === 'Integer' || typeAnnotation.typeName === 'Long')
                // 日期时间格式特殊处理; 整数： format 'int' ; 长整数: format: 'long'
                return /^\d{4}-\d{2}-\d{2}(.*)+/.test(value) ? new Date(value).getTime() : Math.round(+value);
            else if (typeAnnotation.typeName === 'Boolean') // 布尔值
                return !!value;
        }
        return value;
    },
    FromString(value, typeKey) {
        return fromString(value, typeKey);
    },
    /**
     * 时间差
     * @param {dateTime1} 时间
     * @param {dateTime2} 时间
     * @param {calcType} 计算类型：年(y)、季度(q)、月(M)、星期(w)、天数(d)、小时数(h)、分钟数(m)、秒数(s)
    */
    DateDiff(dateTime1, dateTime2, calcType, isAbs = true) {
        if (!dateTime1)
            toastAndThrowError(`内置函数DateDiff入参错误：dateTime1不能为空`);
        if (!dateTime2)
            toastAndThrowError(`内置函数DateDiff入参错误：dateTime2不能为空`);
        // Time
        const timeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
        if (timeReg.test(dateTime1) && timeReg.test(dateTime2)) {
            dateTime1 = `1970-01-01 ${dateTime1}`;
            dateTime2 = `1970-01-01 ${dateTime2}`;
        }
        if (!isValid(new Date(dateTime1)) || !isValid(new Date(dateTime2)))
            return;
        const map = {
            y: differenceInYears,
            q: differenceInQuarters,
            M: differenceInMonths,
            w: differenceInWeeks,
            d: differenceInDays,
            h: differenceInHours,
            m: differenceInMinutes,
            s: differenceInSeconds,
        };
        if (!map[calcType])
            return;
        const method = map[calcType];
        const diffRes = method(new Date(dateTime2), new Date(dateTime1));
        return isAbs ? Math.abs(diffRes) : diffRes;
    },
    // 时区转换
    ConvertTimezone(dateTime, tz) {
        if (!dateTime) {
            toastAndThrowError(`内置函数ConvertTimezone入参错误：指定日期为空`);
        }
        if (!isValid(new Date(dateTime))) {
            toastAndThrowError(`内置函数ConvertTimezone入参错误：指定日期不是合法日期类型`);
        }
        if (!isValidTimezoneIANAString(tz)) {
            toastAndThrowError(`内置函数ConvertTimezone入参错误：传入时区${tz}不是合法时区字符`);
        }
        return formatInTimeZone(dateTime, tz, "yyyy-MM-dd'T'HH:mm:ssxxx");
    }
};

export default {
    install(Vue, options) {
        utils.Vue = Vue;
        Vue.prototype.$utils = utils;
        window.$utils = utils;
        enumsMap = options.enumsMap;
    },
};

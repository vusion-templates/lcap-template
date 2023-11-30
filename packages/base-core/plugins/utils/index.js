import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import Vue from 'vue';
import Decimal from 'decimal.js';
import { dateFormatter } from '../Formatters';
import { toString, isDefString, isDefNumber, isDefList, isDefMap, typeDefinitionMap } from '../dataTypes/tools';
import { findAsync, mapAsync, filterAsync, findIndexAsync, sortAsync, getAppTimezone, naslDateToLocalDate, convertJSDateInTargetTimeZone } from './helper'

let enumsMap = {};
const moment = require('moment');
const momentTZ = require('moment-timezone');

export const baseUtils = {
    Vue: undefined,
    EnumValueToText(value, enumTypeAnnotation) {
        const { typeName, typeNamespace } = enumTypeAnnotation || {};
        if (typeName) {
            let enumName = typeName;
            if (typeNamespace?.startsWith('extensions')) {
                enumName = typeNamespace + '.' + enumName;
            }
            if (enumsMap[enumName]) {
                return enumsMap[enumName][value];
            }
            return '';
        }
        return '';
    },
    StringToEnumValue(value, enumTypeAnnotation) {
        const { typeName, typeNamespace } = enumTypeAnnotation || {};
        if (typeName) {
            let enumName = typeName;
            if (typeNamespace?.startsWith('extensions')) {
                enumName = typeNamespace + '.' + enumName;
            }
            if (enumsMap[enumName] && enumsMap[enumName].hasOwnProperty(value)) {
                return value;
            }
            return null;
        }
        return null;
    },
    EnumToList(enumTypeAnnotation) {
        const { typeName, typeNamespace } = enumTypeAnnotation || {};
        let enumName = typeName;
        if (typeName && typeNamespace?.startsWith('extensions')) {
            enumName = typeNamespace + '.' + enumName;
        }
        const enumeration = enumsMap[enumName];
        if (!enumeration)
            return [];
        else {
            return Object.keys(enumeration).map((key) => ({ text: enumeration[key], value: key }));
        }
    },
    JsonSerialize(v, tz) {
        // 目前入参 v 的类型是 nasl.DateTime、nasl.Date、nasl.Time 时，都是 js 原生 string 类型
        // 只能使用 regex 粗略判断一下
        if (this.isInputValidNaslDateTime(v)) {
            // v3.3 老应用升级的场景，UTC 零时区，零时区展示上用 'Z'，后向兼容
            // v3.4 新应用，使用默认时区时选项，tz 为空
            if (!tz) {
                const d = momentTZ.tz(v, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                return JSON.stringify(d);
            }
            // 新应用，设置为零时区，零时区展示上用 'Z'，后向兼容.
            if (tz === 'UTC') {
                // TODO: 想用 "+00:00" 展示零时区
                const d = momentTZ.tz(v, 'UTC').format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
                return JSON.stringify(d);
            }
            // 新应用，设置为其他时区
            if (tz) {
                const d = momentTZ.tz(v, getAppTimezone(tz)).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                return JSON.stringify(d);
            }
        } else if (typeof v === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(v)) {
            // test if the input v is a pure time-format string in the form of hh:mm:ss
            return JSON.stringify(v);
        } else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
            // test if the input v is a pure date-format string in the form of yyyy-MM-dd
            return JSON.stringify(v);
        } else {
            return JSON.stringify(v);
        }
    },
    Split(str, seperator) {
        if (Object.prototype.toString.call(str) === '[object String]') {
            return str.split(seperator);
        }
        return [];
    },
    Join(arr, seperator) {
        if (Array.isArray(arr)) {
            return arr.join(seperator);
        }
    },
    Concat(...arr) {
        return arr.join('');
    },
    Length(str1) {
        if (isObject(str1)) {
            return Object.keys(str1).length;
        }
        if (typeof str1 !== 'undefined' && str1 !== null && typeof str1.length !== 'undefined') {
            return str1.length;
        }
        return null;
    },
    ToLower(str) {
        return str && str.toLowerCase();
    },
    ToUpper(str) {
        return str && str.toUpperCase();
    },
    Trim(str) {
        return str && str.trim();
    },
    Contains(arr, item) {
        return typeof arr.find((ele) => isEqual(ele, item)) !== 'undefined';
    },
    Add(arr, item) {
        if (Array.isArray(arr)) {
            arr.push(item);
        }
    },
    AddAll(arr, addList) {
        if (Array.isArray(arr) && Array.isArray(addList)) {
            arr.push(...addList);
            return arr.length;
        }
    },
    Remove(arr, item) {
        if (Array.isArray(arr)) {
            const index = arr.indexOf(item);
            ~index && arr.splice(index, 1);
        }
    },
    ListHead(arr) {
        if (!Array.isArray(arr) || arr.length === 0) {
            return null;
        } else {
            return arr[0];
        }
    },
    ListLast(arr) {
        if (!Array.isArray(arr) || arr.length === 0) {
            return null;
        } else {
            return arr[arr.length - 1];
        }
    },
    ListFlatten(arr) {
        if (Array.isArray(arr) && arr.every((elem) => Array.isArray(elem))) {
            return arr.flat();
        } else {
            return null;
        }
    },
    ListTransform(arr, trans) {
        if (Array.isArray(arr)) {
            return arr.map((elem) => trans(elem));
        } else {
            return null;
        }
    },
    async ListTransformAsync(arr, trans) {
        if (Array.isArray(arr)) {
            return await mapAsync(arr, (elem) => trans(elem));
        } else {
            return null;
        }
    },
    ListSum: (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        const nullRemoved = baseUtils.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
        return nullRemoved.length === 0 ? null :
                nullRemoved.reduce((prev, cur) =>
                    // decimal 可解决 0.1 + 0.2 的精度问题，下同
                    new Decimal(cur + '').plus(prev), new Decimal('0')).toNumber();
    },
    ListProduct: (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        const nullRemoved = baseUtils.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
        return nullRemoved.length === 0 ? null :
                nullRemoved.reduce((prev, cur) =>
                    new Decimal(cur + '').mul(prev), new Decimal('1')).toNumber();
    },
    ListAverage: (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        const nullRemoved = baseUtils.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
        return nullRemoved.length === 0 ? null :
                new Decimal(baseUtils.ListSum(nullRemoved)).div(nullRemoved.length).toNumber();
    },
    ListMax: (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        const nullRemoved = baseUtils.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
        return nullRemoved.length === 0 ? null :
                nullRemoved.reduce((prev, cur) => prev >= cur ? prev : cur, nullRemoved[0]);
    },
    ListMin: (arr) => {
        if (!Array.isArray(arr)) {
            return null;
        }
        const nullRemoved = baseUtils.ListFilter(arr, (elem) => elem !== null && elem !== undefined);
        return nullRemoved.length === 0 ? null :
                nullRemoved.reduce((prev, cur) => prev <= cur ? prev : cur, nullRemoved[0]);
    },
    ListReverse(arr) {
        if (Array.isArray(arr)) {
            arr.reverse();
        }
    },
    ListSort(arr, callback, sort) {
        if (Array.isArray(arr)) {
            if (typeof callback === 'function') {
                arr.sort((a, b) => {
                    const valueA = callback(a);
                    const valueB = callback(b);
                    if (Number.isNaN(valueA) || Number.isNaN(valueB) || typeof valueA === 'undefined' || typeof valueB === 'undefined' || valueA === null || valueB === null) {
                        return 1;
                    } else {
                        if (valueA >= valueB) {
                            if (sort) {
                                return 1;
                            }
                            return -1;
                        } else {
                            if (sort) {
                                return -1;
                            }
                            return 1;
                        }
                    }
                });
            }
        }
    },
    async ListSortAsync(arr, callback, sort) {
        const sortRule = (valueA, valueB) => {
            if (Number.isNaN(valueA) || Number.isNaN(valueB) || typeof valueA === 'undefined' || typeof valueB === 'undefined' || valueA === null || valueB === null) {
                return 1;
            } else {
                if (valueA >= valueB) {
                    if (sort) {
                        return 1;
                    }
                    return -1;
                } else {
                    if (sort) {
                        return -1;
                    }
                    return 1;
                }
            }
        };
        if (Array.isArray(arr)) {
            if (typeof callback === 'function') {
                return await sortAsync(arr, sortRule)(callback);
            }
        }
    },
    ListFind(arr, by) {
        if (Array.isArray(arr)) {
            if (typeof by === 'function') {
                const value = arr.find(by);
                return (typeof value === 'undefined') ? null : value;
            }
        }
    },
    async ListFindAsync(arr, by) {
        if (Array.isArray(arr)) {
            if (typeof by === 'function') {
                const value = await findAsync(arr, by);
                return (typeof value === 'undefined') ? null : value;
            }
        }
    },
    ListFilter: (arr, by) => {
        if (!Array.isArray(arr) || typeof by !== 'function') {
            return null;
        }
        return arr.filter(by);
    },
    ListFilterAsync: async (arr, by) => {
        if (!Array.isArray(arr) || typeof by !== 'function') {
            return null;
        }
        return await filterAsync(arr, by);
    },
    ListFindIndex(arr, callback) {
        if (Array.isArray(arr)) {
            if (typeof callback === 'function') {
                return arr.findIndex(callback);
            }
        }
    },
    async ListFindIndexAsync(arr, callback) {
        if (Array.isArray(arr)) {
            if (typeof callback === 'function') {
                return await findIndexAsync(arr, callback);
            }
        }
    },
    ListDistinct(arr) {
        if (Array.isArray(arr)) {
            const map = new Map();
            let i = 0;
            while (i < arr.length) {
                if (map.get(arr[i])) {
                    arr.splice(i, 1);
                    i--;
                } else {
                    map.set(arr[i], true);
                }
                i++;
            }
        }
    },
    // 随着 PageOf 失效，可删除
    ListSliceToPageOf(arr, page, size) {
        if (Array.isArray(arr) && page) {
            const start = (page - 1) * size;
            const end = start + size;
            const content = arr.slice(start, end);
            const total = arr.length;
            const totalPages = Math.ceil(total / size);
            return {
                content,
                number: page,
                size,
                numberOfElements: content.length,
                totalPages,
                totalElements: total,
                last: page === totalPages,
                first: page === 1,
                empty: total,
            };
        }
    },
    SliceToListPage(arr, page, size) {
        if (Array.isArray(arr) && page) {
            const start = (page - 1) * size;
            const end = start + size;
            const list = arr.slice(start, end);
            const total = arr.length;
            return { list, total };
        } else {
            return { list: [], total: 0 };
        }
    },
    // 不修改原 list，返回新 list
    ListDistinctBy(arr, getVal) {
        // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
        if (!Array.isArray(arr) || typeof getVal !== 'function') {
            return null;
        }
        if (arr.length === 0) {
            return arr;
        }

        const res = [];
        const vis = new Set();
        for (const item of arr) {
            const hash = getVal(item);
            if (!vis.has(hash)) {
                vis.add(hash);
                res.push(item);
            }
        }
        return res;
    },
    async ListDistinctByAsync(arr, listGetVal) {
        // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
        // listGetVal: getVal 这样的函数组成的 list

        if (!Array.isArray(arr)) {
            return null;
        }
        // item => List[item.userName, item.id]
        if (arr.length === 0) {
            return arr;
        }

        const res = [];
        const vis = new Set();
        for (const item of arr) {
            // eslint-disable-next-line no-return-await
            const hashArr = listGetVal.map(async (fn) => await fn(item));
            // eslint-disable-next-line no-await-in-loop
            const hash = (await Promise.all(hashArr)).join('');
            if (!vis.has(hash)) {
                vis.add(hash);
                res.push(item);
            }
        }
        return res;
    },
    ListGroupBy(arr, getVal) {
        // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
        if (!arr || typeof getVal !== 'function') {
            return null;
        }
        if (arr.length === 0) {
            return arr;
        }
        const res = {};
        arr.forEach((e) => {
            const val = getVal(e);
            if (res[val]) {
                // res.get(val) 是一个 array
                res[val].push(e);
            } else {
                res[val] = [e];
            }
        });
        return res;
    },
    async ListGroupByAsync(arr, getVal) {
        // getVal : <A,B> . A => B 给一个 A 类型的数据，返回 A 类型中被用户选中的 field 的 value
        if (!arr || typeof getVal !== 'function') {
            return null;
        }
        if (arr.length === 0) {
            return arr;
        }
        const res = {};
        for (let i = 0; i < arr.length; i++) {
            const e = arr[i];
            const val = await getVal(e);
            if (Array.isArray(res[val])) {
                // res.get(val) 是一个 array
                res[val].push(e);
            } else {
                res[val] = [e];
            }
        }
        return res;
    },
    MapGet(map, key) {
        if (isObject(map)) {
            const value = map[key];
            return (typeof value === 'undefined') ? null : value;
        }
    },
    MapPut(map, key, value) {
        if (isObject(map)) {
            Vue.prototype.$set(map, key, value);
        }
    },
    MapRemove(map, key) {
        if (isObject(map)) {
            baseUtils.Vue.delete(map, key);
        }
    },
    MapContains(map, key) {
        if (isObject(map)) {
            return key in map;
        }
        return false;
    },
    MapKeys(map) {
        if (isObject(map)) {
            return Object.keys(map);
        }
        return 0;
    },
    MapValues(map) {
        if (!isObject(map)) {
            return [];
        }
        if ('values' in Object) {
            return Object.values(map);
        } else {
            const res = [];
            for (const key in map) {
                if (Object.hasOwnProperty.call(map, key)) {
                    res.push(map[key]);
                }
            }
            return res;
        }
    },
    MapFilter(map, by) {
        if (!isObject(map) || typeof by !== 'function') {
            return null;
        }
        const res = {};
        for (const [k, v] of Object.entries(map)) {
            if (by(k, v)) {
                res[k] = v;
            }
        }
        return res;
    },
    async MapFilterAsync(map, by) {
        if (!isObject(map) || typeof by !== 'function') {
            return null;
        }
        const res = {};
        for (const [k, v] of Object.entries(map)) {
            if (await by(k, v)) {
                res[k] = v;
            }
        }
        return res;
    },
    MapTransform(map, toKey, toValue) {
        if (!isObject(map) || typeof toKey !== 'function' || typeof toValue !== 'function') {
            return null;
        }
        const res = {};
        for (const [k, v] of Object.entries(map)) {
            res[toKey(k, v)] = toValue(k, v);
        }
        return res;
    },
    async MapTransformAsync(map, toKey, toValue) {
        if (!isObject(map) || typeof toKey !== 'function' || typeof toValue !== 'function') {
            return null;
        }
        const res = {};
        for (const [k, v] of Object.entries(map)) {
            res[await toKey(k, v)] = await toValue(k, v);
        }
        return res;
    },
    ListToMap(arr, toKey, toValue) {
        if (!Array.isArray(arr) || typeof toKey !== 'function' || typeof toValue !== 'function') {
            return null;
        }
        const res = {};
        for (let i = arr.length - 1; i >= 0; i--) {
            const e = arr[i];
            if (toKey(e) !== undefined) {
                res[toKey(e)] = toValue(e);
            }
        }

        return res;
    },
    async ListToMapAsync(arr, toKey, toValue) {
        if (!Array.isArray(arr) || typeof toKey !== 'function' || typeof toValue !== 'function') {
            return null;
        }
        const res = {};
        for (let i = arr.length - 1; i >= 0; i--) {
            const e = arr[i];
            const key = await toKey(e);
            if (key !== undefined) {
                res[key] = await toValue(e);
            }
        }
        return res;
    },
    CurrDate(tz) {
        if (!tz) {
            return this.CurrDate('global');
        }
        const localDate = convertJSDateInTargetTimeZone(new Date(), tz);
        return moment(localDate).format('YYYY-MM-DD');
    },
    CurrTime(tz) {
        if (!tz) {
            return this.CurrTime('global');
        }
        const localDate = convertJSDateInTargetTimeZone(new Date(), tz);
        return moment(localDate).format('HH:mm:ss');
    },
    CurrDateTime(tz) {
        // 函数签名用的是 Date 原生对象不是 string，所以先这样就行
        return new Date();
    },
    isInputValidNaslDateTime(inp) {
        return inp instanceof Date
            || /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/.test(inp)
            || /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/.test(inp);
    },
    FormatDate(value, formatter) {
        if (!value) {
            return '-';
        }
        return dateFormatter.format(naslDateToLocalDate(value), formatter);
    },
    FormatDateTime(value, formatter, tz) {
        if (!value) {
            return '-';
        }
        if (!tz) {
            return this.FormatDateTime(value, formatter, 'global');
        }
        const date = convertJSDateInTargetTimeZone(value, tz);
        return dateFormatter.format(date, formatter);
    },
    Clone(obj) {
        return cloneDeep(obj);
    },
    New(obj) {
        return baseUtils.Vue.prototype.$genInitFromSchema(obj);
    },
    /**
     * 将内容置空，array 置为 []; object 沿用 ClearObject 逻辑; 其他置为 undefined
     */
    Clear(obj) {
        if (Array.isArray(obj)) {
            obj.splice(0, obj.length);
        } else if (isObject(obj)) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key))
                    obj[key] = null;
            }
        } else {
            obj = undefined;
        }
        return obj;
    },
    /**
     * 保留 ClearObject，兼容老版本，将某个对象所有字段置为空，一般用于 filter
     */
    ClearObject(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key))
                obj[key] = undefined;
        }
        return obj;
    },
    Merge(obj1, obj2) {
        return Object.assign(obj1, obj2);
    },
    RandomInt(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }

        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new TypeError('Expected all arguments to be numbers');
        }

        return Math.floor((Math.random() * (max - min + 1)) + min);
    },
    tryJSONParse(str) {
        let result;

        try {
            result = JSON.parse(str);
        } catch (e) { }

        return result;
    },
    ToString(typeKey, value, tz) {
        // v3.3 老应用升级的场景，使用全局配置（全局配置一般默认是‘用户时区’）
        // v3.4 新应用，使用默认时区时选项，tz 为空
        if (typeKey === 'nasl.core.DateTime' && !tz) {
            return toString(typeKey, value, 'global');
        } else {
            // v3.4 新应用，指定了默认值之外的时区选项，必然有时区参数 tz
            return toString(typeKey, value, getAppTimezone(tz));
        }
    },
    /**
     * 数字格式化
     * @param {digits} 小数点保留个数
     * @param {showGroup} 是否显示千位分割（默认逗号分隔）
    */
    FormatNumber(value, digits, showGroup) {
        if (!value)
            return value;
        if (parseFloat(value) === 0)
            return '0';
        if (isNaN(parseFloat(value)) || isNaN(parseInt(digits)))
            return;
        if (digits !== undefined) {
            value = Number(value).toFixed(parseInt(digits));
        }
        if (showGroup) {
            const temp = ('' + value).split('.');
            const right = temp[1];
            let left = temp[0].split('').reverse().join('').match(/(\d{1,3})/g).join(',').split('').reverse().join('');
            if (temp[0][0] === '-')
                left = '-' + left;
            if (right)
                left = left + '.' + right;
            value = left;
        }
        return '' + value;
    },
    /**
     * 字符串查找
     * @param {string} str 字符串
     * @param {string} search 查找字符串
     * @param {number} fromIndex 开始位置
     * @param {boolean} ignoreCase 是否忽略大小写
     * @returns {number} 查找到的位置，没找到返回-1
     */
    IndexOf(str, search, fromIndex, ignoreCase) {
        if (typeof str !== 'string' || typeof search !== 'string') {
            return -1;
        }
        if (fromIndex === undefined || fromIndex < 0 || fromIndex % 1 !== 0) {
            fromIndex = 0;
        }
        if (ignoreCase) {
            str = str.toLowerCase();
            search = search.toLowerCase();
        }
        return str.indexOf(search, fromIndex);
    },
    /**
     * 倒序字符串查找
     * @param {string} str 字符串
     * @param {string} search 查找字符串
     * @param {boolean} ignoreCase 是否忽略大小写
     * @returns {number} 查找到的位置，没找到返回-1
     */
    LastIndexOf(str, search, ignoreCase) {
        if (typeof str !== 'string' || typeof search !== 'string') {
            return -1;
        }
        if (ignoreCase) {
            str = str.toLowerCase();
            search = search.toLowerCase();
        }
        return str.lastIndexOf(search);
    },
    /**
     * 注意是 ReplaceAll
     * @param {string} str 字符串
     * @param {string} search 查找字符串
     * @param {string} replace 替换字符串
     * @returns {string} 替换后的字符串
     */
    Replace(str, search, replace) {
        if (typeof str !== 'string' || typeof search !== 'string') {
            return str;
        }
        replace = replace.replace(/\$/g, '$$$$');
        return str.replace(new RegExp(search.replace(/([/,!\\^${}[\]().*+?|<>\-&])/g, '\\$&'), 'g'), replace);
    },
    /**
     *
     * @param {string} str 字符串
     * @param {number} start 开始位置
     * @param {number} length 长度
     * @returns {string} 截取后的字符串
     */
    SubString(str, start, length) {
        if (typeof str !== 'string') {
            return str;
        }
        if (start !== undefined && (start < 0 || start % 1 !== 0)) {
            start = 0;
        }
        if (length !== undefined && (length < 0 || length % 1 !== 0)) {
            length = 0;
        }
        return str.substr(start, length);
    },
    // 随着 PageOf 失效，可删除
    /**
     * List<T> 转换为 PageOf<T>
     * @param {List<T>} list 集合
     * @param {number} page 页数
     * @param {number} size 每页条数
     * @param {number} total 总数
     * @returns {PageOf<T>}
     */
    CreatePageOf(list, page, size, total) {
        const totalPages = Math.ceil(total / size);
        return {
            content: list,
            number: page,
            size,
            numberOfElements: list.length,
            totalPages,
            totalElements: total,
            last: page === totalPages,
            first: page === 1,
            empty: total,
        };
    },
    /**
     * List<T> 转换为 { list: List<T>, total: Integer }
     * @param {List<T>} list 集合
     * @param {number} total 总数
     * @returns {list: List<T>, total: Integer}
     */
    CreateListPage(list, total) {
        return { list, total };
    },
    /**
     * @param {number} value 内容
     * @param {string} mode 方式
     * @returns {number} 返回值
     */
    Round(value, mode) {
        const modeMap = {
            TowardsZero: Decimal.ROUND_DOWN,
            TowardsInfinity: Decimal.ROUND_UP,
            HalfUp: Decimal.ROUND_HALF_UP,
        };
        return new Decimal(value).toFixed(0, modeMap[mode]);
    },
    /**
     * 空值判断（与）
     * @param {Object[]} values 值
     * @returns {boolean} 返回值
     */
    HasValue(...values) {
        const hasValue = (value, typeKey) => {
            const typeDefinition = typeDefinitionMap[typeKey] || {};

            if (['nasl.core.Null'].includes(typeKey) || value === undefined || value === null) {
                return false;
            } else if (['nasl.core.Boolean'].includes(typeKey) || value === true || value === false) {
                return true;
            } else if (['nasl.core.DateTime'].includes(typeKey)) {
                return !!value;
            } else if (isDefString(typeKey)) {
                return value.trim() !== '';
            } else if (isDefNumber(typeKey)) {
                return !isNaN(value);
            } else if (isDefList(typeDefinition)) {
                return value && value.length > 0;
            } else if (isDefMap(typeDefinition)) {
                return Object.keys(value).length > 0;
            } else if (typeof value === 'string') {
                return value.trim() !== '';
            } else if (typeof value === 'number') {
                return !isNaN(value);
            } else if (Array.isArray(value)) {
                return value && value.length > 0;
            } else {
                // structure/entity
                return !Object.keys(value).every((key) => {
                    const v = value[key];
                    return v === null || v === undefined;
                });
            }
        };

        let isValid = true;

        for (let i = 0; i < values.length; i += 1) {
            const { value, type } = values[i] || {};

            if (!hasValue(value, type)) {
                isValid = false;
                break;
            }
        }

        return isValid;
    },
};

export function toValue(date, typeKey) {
    if (!date)
      return date;
    if (typeKey === 'format')
      return moment(date).format('YYYY-MM-DD'); // value 的真实格式
    else if (typeKey === 'json')
      return baseUtils.JsonSerialize(date);
    else if (typeKey === 'timestamp')
      return date.getTime();
    else
      return date;
}

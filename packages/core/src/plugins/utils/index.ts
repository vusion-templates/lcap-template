import isObject from "lodash/isObject";

import {
  isArrayInBounds,
  utils as Utils,
  initUtils,
} from '@lcap/basic-template';

export const utils = {
  Vue: undefined,

  EnumItemToText: Utils.EnumItemToText,
  EnumItemToStructure: Utils.EnumItemToStructure,
  ToEnumItem: Utils.ToEnumItem,
  EnumToList: Utils.EnumToList,
  JsonSerialize: Utils.JsonSerialize,
  JsonDeserialize: Utils.tryJSONParse,
  Split: Utils.Split,
  Join: Utils.Join,
  Concat: Utils.Concat,
  Length: Utils.Length,
  ToLower: Utils.ToLower,
  ToUpper: Utils.ToUpper,
  Trim: Utils.Trim,
  Get: Utils.Get,
  Set(arr, index, item) {
    if (isArrayInBounds(arr, index)) {
      return utils.Vue.set(arr, index, item);
    }
  },
  Contains: Utils.Contains,
  Add: Utils.Add,
  AddAll: Utils.AddAll,
  Insert: Utils.Insert,
  Remove: Utils.Remove,
  RemoveAt: Utils.RemoveAt,
  ListHead: Utils.ListHead,
  ListLast: Utils.ListLast,
  ListFlatten: Utils.ListFlatten,
  ListTransform: Utils.ListTransform,
  ListTransformAsync: Utils.ListTransformAsync,
  ListSum: Utils.ListSum,
  ListProduct: Utils.ListProduct,
  ListAverage: Utils.ListAverage,
  ListMax: Utils.ListMax,
  ListMin: Utils.ListMin,
  ListReverse: Utils.ListReverse,
  ListSort: Utils.ListSort,
  ListSortAsync: Utils.ListSortAsync,
  ListFind: Utils.ListFind,
  ListFindAsync: Utils.ListFindAsync,
  ListFilter: Utils.ListFilter,
  ListFilterAsync: Utils.ListFilterAsync,
  ListFindIndex: Utils.ListFindIndex,
  ListFindIndexAsync: Utils.ListFindIndexAsync,
  ListSlice: Utils.ListSlice,
  ListDistinctBy: Utils.ListDistinctBy,
  ListDistinctByAsync: Utils.ListDistinctByAsync,
  ListGroupBy: Utils.ListGroupBy,
  ListGroupByAsync: Utils.ListGroupByAsync,
  MapGet: Utils.MapGet,
  MapPut(map, key, value) {
    if (isObject(map)) {
      utils.Vue.set(map, key, value);
    }
  },
  MapRemove(map, key) {
    if (isObject(map)) {
      utils.Vue.delete(map, key);
    }
  },
  MapContains: Utils.MapContains,
  MapKeys: Utils.MapKeys,
  MapValues: Utils.MapValues,
  MapFilter: Utils.MapFilter,
  MapFilterAsync: Utils.MapFilterAsync,
  MapTransform: Utils.MapTransform,
  MapTransformAsync: Utils.MapTransformAsync,
  ListToMap: Utils.ListToMap,
  ListToMapAsync: Utils.ListToMapAsync,
  ListFindAll: Utils.ListFindAll,
  ListDistinct: Utils.ListDistinct,
  // 随着 PageOf 失效，可删除
  ListSliceToPageOf: Utils.ListSliceToPageOf,
  SliceToListPage: Utils.SliceToListPage,
  CurrDate: Utils.CurrDate,
  CurrTime: Utils.CurrTime,
  CurrDateTime: Utils.CurrDateTime,
  AddDays: Utils.AddDays,
  AddMonths: Utils.AddMonths,
  SubDays: Utils.SubDays,
  // 兼容性策略：老应用升级到 3.10，保持老行为不变
  GetDateCountOld: Utils.GetDateCountOld,
  GetDateCount: Utils.GetDateCount,
  AlterDateTime: Utils.AlterDateTime,
  isInputValidNaslDateTime: Utils.isInputValidNaslDateTime,
  GetSpecificDaysOfWeek: Utils.GetSpecificDaysOfWeek,
  FormatDate: Utils.FormatDate,
  FormatTime: Utils.FormatTime,
  FormatDateTime: Utils.FormatDateTime,
  Clone: Utils.Clone,
  New: Utils.New,
  /**
   * 将内容置空，array 置为 []; object 沿用 ClearObject 逻辑; 其他置为 undefined
   */
  Clear: Utils.Clear,
  /**
   * 保留 ClearObject，兼容老版本，将某个对象所有字段置为空，一般用于 filter
   */
  ClearObject: Utils.ClearObject,
  Merge: Utils.Merge,
  RandomInt: Utils.RandomInt,
  tryJSONParse: Utils.tryJSONParse,
  Convert: Utils.Convert,
  ToString: Utils.ToString,
  FromString: Utils.FromString,
  FormatNumber: Utils.FormatNumber,
  FormatPercent: Utils.FormatPercent,
  DateDiff: Utils.DateDiff,
  // 时区转换
  ConvertTimezone: Utils.ConvertTimezone,
  IndexOf: Utils.IndexOf,
  LastIndexOf: Utils.LastIndexOf,
  Replace: Utils.Replace,
  SubString: Utils.SubString,
  // 随着 PageOf 失效，可删除
  CreatePageOf: Utils.CreatePageOf,
  CreateListPage: Utils.CreateListPage,
  Round: Utils.Round,
  /**
   * 空值判断（与）
   * @param {Object[]} values 值
   * @returns {boolean} 返回值
   */
  HasValue: Utils.HasValue,
};

export default {
  install(Vue, options) {
    utils.Vue = Vue;

    initUtils(options);
  },
};

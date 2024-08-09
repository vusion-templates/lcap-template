import { 
  genInitFromSchema,
  isLooseEqualFn,
  resolveRequestData,
  enums,
  Utils,
  Tools,
  processPorts,
} from '@lcap/basic-template';

import Config from '../../config'

const databaseLoadFunMap = new Map();

export default {
  install(Vue, options) {
    const dataTypesMap = options.dataTypesMap || {}; // TODO 统一为  dataTypesMap
    const i18nInfo = options.i18nInfo || {};
    Tools.initApplicationConstructor(dataTypesMap, genInitFromSchema);
    /**
     * read datatypes from template, then parse schema
     * @param {*} schema 是前端用的 refSchema
     */
    Vue.prototype.$genInitFromSchema = genInitFromSchema;
    window.$genInitFromSchema = genInitFromSchema;

    const {
      frontendVariables,
      localCacheVariableSet
    } = Config.getFrontendVariables(options);

    const $g = {
      // 用户信息
      userInfo: {},
      // 国际化信息
      i18nInfo: i18nInfo,
      // 前端全局变量
      frontendVariables,

      // 加
      add: Utils.add,
      // 减
      minus: Utils.minus,
      // 乘
      multiply: Utils.multiply,
      // 除
      divide: Utils.divide,
      // 相等
      isEqual: Utils.isEqual,
      requestFullscreen: Utils.requestFullscreen,
      exitFullscreen: Utils.exitFullscreen,
      encryptByAES: Utils.encryptByAES,
      decryptByAES: Utils.decryptByAES,
      hasAuth: Utils.hasAuth,
      getLocation: Utils.getLocation,
      getDistance: Utils.getDistance,
      getCustomConfig: Utils.getCustomConfig,
      getCurrentIp: Utils.getCurrentIp,
      getUserLanguage: Utils.getUserLanguage,

      useDatabaseCallback() {
        //  是这样调用的 $global.useDatabaseCallback()(__tableView_1_handleDataSourceLoad)
        return function (loadFun, ...args) {
          let loadMap = databaseLoadFunMap.get(loadFun);
          const cacheKey = $g.stringifyCurrentOnce([loadFun, ...args]);
          if (!loadMap) {
            loadMap = new Map();
            loadMap.set(cacheKey, (params) => {
              return loadFun(params, ...args);
            });
            databaseLoadFunMap.set(loadFun, loadMap);
          } else {
            if (!loadMap.has(cacheKey)) {
              loadMap.set(cacheKey, (params) => {
                return loadFun(params, ...args);
              });
            }
          }
          return loadMap.get(cacheKey);
        };
      },
      // 自定义的解决循环引用的函数
      stringifyCurrentOnce(array) {
        const newArray = array.map((current) => {
          // 只认current声明的key，其余的可能有vm，所以只认这几个属性
          if (typeof current === "object" && current !== null) {
            return {
              item: current.item,
              index: current.index,
              rowIndex: current.rowIndex,
              columnIndex: current.columnIndex,
              value: current.value,
            };
          }
          return current;
        });
        
        const seen = new WeakSet(); // 用于跟踪对象引用
        return JSON.stringify(newArray, (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              // 如果已经序列化过这个对象，避免循环引用
              return;
            }
            seen.add(value);
          }
          return value;
        });
      },
    };
    const $global = Config.setGlobal($g);

    Object.keys(processPorts).forEach((service) => {
      $global[service] = processPorts[service];
    });
    
    new Vue({
      data: {
        $global,
      },
    });

    Vue.prototype.$localCacheVariableSet = localCacheVariableSet;
    Vue.prototype.$global = $global;
    window.$global = $global;

    Vue.prototype.$isInstanceOf = Tools.isInstanceOf;
    // 判断两个对象是否相等，不需要引用完全一致
    Vue.prototype.$isLooseEqualFn = isLooseEqualFn;
    Vue.prototype.$enums = (key, value) => {
      return enums(key, value, options.enumsMap || {});
    };
    Vue.prototype.$resolveRequestData = resolveRequestData;
  }
}

export {
  genInitFromSchema,
}

export const genSortedTypeKey = Tools.genSortedTypeKey;
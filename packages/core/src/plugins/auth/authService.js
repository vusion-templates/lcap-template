import Vue from 'vue';
import qs from "qs";
import { initService as authInitService } from '../../apis/auth';
import { initService as lowauthInitService } from '../../apis/lowauth';
import cookie from '../../utils/cookie';
import { getBasePath } from '../../utils/encodeUrl';

export const getBaseHeaders = () => {
    const headers = {
        Env: window.appInfo && window.appInfo.env,
    };
    if (cookie.get('authorization')) {
        headers.Authorization = cookie.get('authorization');
    }
    return headers;
};

export default {
  _map: undefined,
  authService: undefined,
  lowauthInitService: undefined,
  start() {
    this.authService = authInitService();
    this.lowauthInitService = lowauthInitService();
    window.authService = this.authService;
  },
  getUserInfo() {
    let userInfoPromise = null;

    if (window.appInfo.hasUserCenter) {
      userInfoPromise = this.lowauthInitService.GetUser({
        headers: getBaseHeaders(),
        config: {
          noErrorTip: true,
        },
      });
    } else {
      userInfoPromise = this.authService.GetUser({
        headers: getBaseHeaders(),
        config: {
          noErrorTip: true,
        },
      });
    }

    userInfoPromise = userInfoPromise
      .then((result) => {
        // 兼容新的返回格式
        let userInfo;
        if (result?.data?.Data) {
          userInfo = result.data.Data;
        } else {
          userInfo = result?.Data;
        }

        if (!userInfo?.UserId && userInfo?.userId) {
          userInfo.UserId = userInfo.userId;
          userInfo.UserName = userInfo.userName;
        }
        const $global = Vue.prototype.$global || {};
        const frontendVariables =
          Vue.prototype.$global.frontendVariables || {};
        frontendVariables.userInfo = userInfo;
        $global.userInfo = userInfo;
        return userInfo;
      })
      .catch((e) => {
        console.error("获取用户信息失败", e)
        throw e;
      });
    
    return userInfoPromise;
  },
  getUserResources(DomainName) {
    let userResourcesPromise = null;
    if (window.appInfo.hasAuth) {
      userResourcesPromise = this.lowauthInitService
        .GetUserResources({
          headers: getBaseHeaders(),
          query: {
            // userId: Vue.prototype.$global.userInfo.UserId,
            // userName: Vue.prototype.$global.userInfo.UserName,
          },
          config: {
            noErrorTip: true,
          },
        })
        .then((result) => {
          // 兼容新的返回格式
          const data = result?.data || result;

          let resources = [];
          // 初始化权限项
          this._map = new Map();
          if (Array.isArray(data)) {
            resources = data.filter(
              (resource) => resource?.resourceType === "ui"
            );
            resources.forEach((resource) =>
              this._map.set(resource.resourceValue, resource)
            );
          }
          return resources;
        });
    } else {
      // 这个是非下沉应用，调用的是Nuims的接口，此处需非常注意Resource大小写情况，开发时需关注相关测试用例是否覆盖
      userResourcesPromise = this.authService
        .GetUserResources({
          headers: getBaseHeaders(),
          query: {
            DomainName,
          },
          config: {
            noErrorTip: true,
          },
        })
        .then((res) => {
          this._map = new Map();
          const resources = res.Data.items.reduce(
            (acc, { ResourceType, ResourceValue, ...item }) => {
              if (ResourceType === "ui") {
                acc.push({
                  ...item,
                  ResourceType,
                  ResourceValue,
                  resourceType: ResourceType,
                  resourceValue: ResourceValue,
                }); // 兼容大小写写法，留存大写，避免影响其他隐藏逻辑
              }
              return acc;
            },
            []
          );
          // 初始化权限项
          resources.forEach((resource) =>
            this._map.set(resource?.ResourceValue, resource)
          );
          return resources;
        });
    }
    return userResourcesPromise;
  },
  async getKeycloakLogoutUrl() {
    let logoutUrl = "";
    const basePath = getBasePath();
    if (window.appInfo.hasUserCenter) {
      const res = await this.lowauthInitService.getAppLoginTypes({
        query: {
          Action: "GetTenantLoginTypes",
          Version: "2020-06-01",
          TenantName: window.appInfo.tenant,
        },
      });
      const KeycloakConfig = res?.Data.Keycloak;
      if (KeycloakConfig) {
        logoutUrl = `${KeycloakConfig?.config?.logoutUrl}?redirect_uri=${window.location.protocol}//${window.location.host}${basePath}/login`;
      }
    } else {
      const res = await this.authService.getNuimsTenantLoginTypes({
        query: {
          Action: "GetTenantLoginTypes",
          Version: "2020-06-01",
          TenantName: window.appInfo.tenant,
        },
      });
      const KeycloakConfig = res?.Data.find(
        (item) => item.LoginType === "Keycloak"
      );
      if (KeycloakConfig) {
        logoutUrl = `${KeycloakConfig?.extendProperties?.logoutUrl}?redirect_uri=${window.location.protocol}//${window.location.host}${basePath}/login`;
      }
    }

    return logoutUrl;
  },
  async logout() {
    const sleep = (t) => new Promise((r) => setTimeout(r, t));

    if (window.appInfo.hasUserCenter) {
      const logoutUrl = await this.getKeycloakLogoutUrl();
      localStorage.setItem("logoutUrl", logoutUrl);
      if (logoutUrl) {
        window.location.href = logoutUrl;
        await sleep(1000);
      } else {
        return this.lowauthInitService
          .Logout({
            headers: getBaseHeaders(),
          })
          .then(() => {
            // 用户中心，去除认证和用户名信息
            cookie.erase("authorization");
            cookie.erase("username");
          });
      }
    } else {
      const logoutUrl = await this.getKeycloakLogoutUrl();
      localStorage.setItem("logoutUrl", logoutUrl);
      if (logoutUrl) {
        window.location.href = logoutUrl;
        await sleep(1000);
      } else {
        return this.authService
          .Logout({
            headers: getBaseHeaders(),
          })
          .then(() => {
            cookie.erase("authorization");
            cookie.erase("username");
          });
      }
    }
  },
  loginH5(data) {
    return this.authService.LoginH5({
      headers: getBaseHeaders(),
      ...data,
    });
  },
  getNuims(query) {
    return this.authService.GetNuims({
      headers: getBaseHeaders(),
      query,
    });
  },
  getConfig() {
    return this.authService.GetConfig({
      headers: getBaseHeaders(),
    });
  },
  // 处理数据的参数转化
  parse: qs.parse,
  stringify: qs.stringify,
  /**
   * 权限服务是否初始化
   */
  isInit() {
    return !!this._map;
  },
  /**
   * 初始化权限服务
   */
  init(domainName) {
    return this.getUserInfo().then(() => this.getUserResources(domainName));
  },
  /**
   * 是否有权限
   * @param {*} authPath 权限路径，如 /dashboard/entity/list
   */
  has(authPath) {
    return (this._map && this._map.has(authPath)) || false;
  },
};

export const runAhead = function (domainName) {
    authInitService().init(domainName);
};
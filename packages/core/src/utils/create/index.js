import axios from 'axios';
import Service from 'request-pre';
import { stringify } from 'qs';

import cookie from "../cookie";
import { addConfigs, shortResponse } from "./add.configs";
import { getFilenameFromContentDispositionHeader } from "./tools";
import paramsSerializer from "./paramsSerializer";
import { formatMicroFrontUrl } from "../../plugins/router/microFrontUrl"; // 微前端路由方法

import Config from '../../config';
import { createMockServiceByData} from "./mockData.js";
const getData = (str)=> (new Function('return ' + str))();


const formatContentType = function (contentType, data) {
  const map = {
    "application/x-www-form-urlencoded"(data) {
      return stringify(data);
    },
  };
  return map[contentType] ? map[contentType](data) : data;
};

const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

const foramtCookie = (cookieStr) => {
  const result = {};
  if (document.cookie.length <= 0) {
    return result;
  }
  const obj = parseCookie(cookieStr);
  Object.keys(obj).forEach((key) => {
    result[key] = {
      name: key,
      value: obj[key],
      domain: "", // 前端只能拿到k v 其他字段补齐即可
      cookiePath: "",
      sameSite: "",
      httpOnly: "",
      secure: "",
      maxAge: "",
    };
  });
  return result;
};

/**
 * 目前主要测试的是 get 请求
 * 图片，文件，和文件流形式的下载
 * https://raw.githubusercontent.com/vusion/cloud-ui/master/src/assets/images/1.jpg
 * 支持 query 参数
 */
function download(url) {
    const { path, method, body = {}, headers = {}, query = {}, timeout } = url;

    return axios({
        url: path,
        method,
        params: query,
        data: formatContentType(headers['Content-Type'], body),
        responseType: 'blob',
        timeout,
    }).then((res) => {
        // 包含 content-disposition， 从中解析名字，不包含 content-disposition 的获取请求地址的后缀
        let effectiveFileName = res.request.getAllResponseHeaders().includes('content-disposition') ? getFilenameFromContentDispositionHeader(res.request.getResponseHeader('content-disposition')) : res.request.responseURL.split('/').pop();
        const { data, status, statusText } = res;
        // 如果没有size长度 PC端独有👇
        if (Config.utils?.decodeDownloadName) {
          effectiveFileName = Config.utils?.decodeDownloadName(effectiveFileName);
          if (data && data.size === 0) {
            return Promise.resolve({
              data: {
                code: status,
                msg: statusText,
              },
            });
          }
        }
        // 👆
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', effectiveFileName); // any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
        return Promise.resolve({
            data: {
                code: status,
                msg: statusText,
            },
        });
    }).catch((err) =>
        // 基于 AxiosError 的错误类型 https://github.com/axios/axios/blob/b7e954eba3911874575ed241ec2ec38ff8af21bb/index.d.ts#L85
        Promise.resolve({
            data: {
                code: err.code,
                msg: err.response.statusText,
            },
        }));
}

const requester = function (requestInfo) {
  const { url, config = {} } = requestInfo;
  const { method, body = {}, headers = {}, query = {} } = url;
  const path = formatMicroFrontUrl(url.path);

  const baseURL = config.baseURL ? config.baseURL : "";
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (!headers.Authorization && cookie.get("authorization")) {
    headers.Authorization = cookie.get("authorization");
  }
  headers.DomainName = window.appInfo?.domainName;
  if (window.appInfo?.frontendName)
    headers["LCAP-FRONTEND"] = window.appInfo?.frontendName;
  // 用户本地时区信息，传递给后端
  headers.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (config.download) {
    return download(url);
  }
  let data;
  const method2 = method.toUpperCase();
  if (
    Array.isArray(body) ||
    Object.keys(body).length ||
    ["PUT", "POST", "PATCH", "DELETE"].includes(method2)
  ) {
    data = formatContentType(headers["Content-Type"], body);
  }

  if (Config.utils?.axiosInterceptors?.length) {
    Config.utils?.axiosInterceptors.forEach((interceptor) => {
      const { onSuccess, onError } = interceptor;
      axios.interceptors.response.use(onSuccess, onError);
    });
  }

  const req = axios({
    params: query,
    paramsSerializer,
    baseURL,
    method: method2,
    url: path,
    data,
    headers,
    withCredentials: !baseURL,
    xsrfCookieName: "csrfToken",
    xsrfHeaderName: "x-csrf-token",
  });
  return req;
};
const service = new Service(requester);

// 调整请求路径
const adjustPathWithSysPrefixPath = (apiSchemaList) => {
    const newApiSchemaMap = {};
    if (apiSchemaList) {
        for (const key in apiSchemaList) {
            if (!newApiSchemaMap[key]) {
              const { url, ...others } = apiSchemaList[key] || {};
                newApiSchemaMap[key] = {
                    url: {
                        ...url,
                    },
                    ...others,
                };
            }
            const newApiSchema = newApiSchemaMap[key];
            const path = newApiSchema?.url?.path;
            const sysPrefixPath = window.appInfo?.sysPrefixPath;
            if (path && path.startsWith('/') && sysPrefixPath) {
                newApiSchema.url.path = sysPrefixPath + path;
            }
        }
    }
    return newApiSchemaMap;
};

export const createService = function createService(apiSchemaList, serviceConfig, dynamicServices) {
    addConfigs(service);
    const fixServiceConfig = serviceConfig || {};
    fixServiceConfig.config = fixServiceConfig.config || {};
    Object.assign(fixServiceConfig.config, {
        httpCode: true,
        httpError: true,
        shortResponse: true,
    });
    serviceConfig = fixServiceConfig;
    const newApiSchemaMap = adjustPathWithSysPrefixPath(apiSchemaList);
    let logicsInstance = service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
    console.log('logicsInstance',JSON.stringify(logicsInstance),logicsInstance['GetUser'])
    let mockInstance ={}

      if (window.appInfo.isPreviewFe) {
        if(window?.allMockData?.mock){
            JSON.parse(window?.allMockData?.mock).map(v=>{
             createMockServiceByData(v.name, getData(v.mockData), mockInstance)
            })
            createMockServiceByData('GetUser', {}, mockInstance)
            createMockServiceByData('GetUserResources', {}, mockInstance)
            Object.keys(logicsInstance).map(apiName => !mockInstance[apiName] && (mockInstance[apiName]= logicsInstance[apiName]))
        }
     }else{
        mockInstance = logicsInstance
     }
     return mockInstance
};

export const createLogicService = function createLogicService(apiSchemaList, serviceConfig, dynamicServices) {
    const fixServiceConfig = serviceConfig || {};
    fixServiceConfig.config = fixServiceConfig.config || {};
    Object.assign(fixServiceConfig.config, {
        // httpCode: true,
        // httpError: true,
        shortResponse: true,
        concept: 'Logic',
    });
    serviceConfig = fixServiceConfig;
    const newApiSchemaMap = adjustPathWithSysPrefixPath(apiSchemaList);
    if (window.preRequest) {
      let resolve  = (requestInfo, preData) => {
        const HttpRequest = {
            requestURI: requestInfo.url.path,
            remoteIp: '',
            requestMethod: requestInfo.url.method,
            body: JSON.stringify(requestInfo.url.body),
            headers: requestInfo.url.headers,
            querys: JSON.stringify(requestInfo.url.query),
            cookies: foramtCookie(document.cookie),
            requestInfo
        };
        return  window.preRequest && window.preRequest(HttpRequest, preData);
      }

        service.preConfig.set('preRequest',   {resolve});
        serviceConfig.config.preRequest = true;
    }
    if (window.postRequest) {
        service.postConfig.set('postRequest', {
            resolve(response, params, requestInfo) {
                if (!response) {
                    return Promise.reject();
                }
                const status = 'success';
                const { config } = requestInfo;
                const serviceType = config?.serviceType;
                if (serviceType && serviceType === 'external') {
                    return response;
                }
                const HttpResponse = {
                    status: response.status + '',
                    body: JSON.stringify(response.data),
                    headers: response.headers,
                    cookies: foramtCookie(document.cookie),
                };
                window.postRequest && window.postRequest(HttpResponse, requestInfo, status);
                return response;
            },
        });
        service.postConfig.set('postRequestError', {
            reject(response, params, requestInfo) {
                response.Code = response.code || response.status;
                const status = 'error';
                const err = response;
                const { config } = requestInfo;
                if (err === 'expired request') {
                    throw err;
                }
                if (!err.response) {
                    if (!config.noErrorTip) {
                        // instance.show('系统错误，请查看日志！');
                        Config.Toast.show('系统错误，请查看日志！');
                        return;
                    }
                }
                if (window.LcapMicro?.loginFn) {
                    if (err.Code === 401 && err.Message === 'token.is.invalid') {
                        window.LcapMicro.loginFn();
                        return;
                    }
                    if (err.Code === 'InvalidToken' && err.Message === 'Token is invalid') {
                        window.LcapMicro.loginFn();
                        return;
                    }
                }
                if (err.Code === 501 && err.Message === 'abort') {
                    throw Error('程序中止');
                }
                const HttpResponse = {
                    status: response.response.status + '',
                    body: JSON.stringify(response.response.data),
                    headers: response.response.headers,
                    cookies: foramtCookie(document.cookie),
                };
                window.postRequest && window.postRequest(HttpResponse, requestInfo, status);
                throw err;
            },
        });
        serviceConfig.config = {
            ...serviceConfig.config,
            priority: {
                ...(serviceConfig.config.priority ? serviceConfig.config.priority : {}),
                postRequest: 10,
                postRequestError: 10,
            },
        };
        serviceConfig.config.postRequest = true;
        serviceConfig.config.postRequestError = true;
    }
    service.postConfig.set('lcapLocation', (response, params, requestInfo) => {
        const lcapLocation = response?.headers['lcap-location'];
        if (lcapLocation) {
            location.href = lcapLocation;
        }
        return response;
    });
    serviceConfig.config = {
        ...serviceConfig.config,
        priority: {
            ...(serviceConfig.config.priority ? serviceConfig.config.priority : {}),
            lcapLocation: 1,
        },
    };
    serviceConfig.config.lcapLocation = true;
    service.postConfig.set('shortResponse', shortResponse);
    let logicsInstance=  service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
    console.log('logicsInstance  Logic',JSON.stringify(logicsInstance))
    let mockInstance ={}
    if (window.appInfo.isPreviewFe) {
        if(window?.allMockData?.mock){
            let mockApiList =JSON.parse(window?.allMockData?.mock).map(v=>v.name)
            JSON.parse(window?.allMockData?.mock).map(v=>{
             createMockServiceByData(v.name, getData(v.mockData), mockInstance)
            })
            Object.keys(logicsInstance).map(apiName => !mockInstance[apiName] && (mockInstance[apiName]= logicsInstance[apiName]))
        }
     }else{
        mockInstance= logicsInstance
     }
    return mockInstance
};

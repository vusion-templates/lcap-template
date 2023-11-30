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
        service.preConfig.set('preRequest', (requestInfo, preData) => {
            const HttpRequest = {
                requestURI: requestInfo.url.path,
                remoteIp: '',
                requestMethod: requestInfo.url.method,
                body: JSON.stringify(requestInfo.url.body),
                headers: requestInfo.url.headers,
                querys: JSON.stringify(requestInfo.url.query),
                cookies: foramtCookie(document.cookie),
            };

            window.preRequest && window.preRequest(HttpRequest, preData);
        });
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
                        instance.show('系统错误，请查看日志！');
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
    return service.generator(newApiSchemaMap, dynamicServices, serviceConfig);
};

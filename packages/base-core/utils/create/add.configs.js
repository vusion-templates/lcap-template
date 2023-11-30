
export const isPromise = function (func) {
    return func && typeof func.then === 'function';
};

export function httpCode(response, params, requestInfo) {
    const { config } = requestInfo;
    const serviceType = config?.serviceType;
    if (serviceType && serviceType === 'external') {
        return response;
    }
    const data = response.data; // cloneDeep(response.data, (value) => value === null ? undefined : value);
    const code = data.code || data.Code;
    if ((code === undefined) || (code === 'Success') || (code + '').startsWith('2')) {
        return response;
    }
    return Promise.reject({
        code,
        msg: data.msg || data.Message,
    });
}
export function shortResponse(response, params, requestInfo) {
    if (requestInfo.config?.concept === 'Logic') {
        return response.data?.Data !== undefined ? response.data?.Data : response.data;
    }
    return response.data;
}

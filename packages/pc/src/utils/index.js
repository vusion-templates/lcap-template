import axios from 'axios';

export default {
    axiosInterceptors: () => {
        axios.interceptors.response.use(
            function (response) {
              if (response.headers.authorization) {
                response.data.authorization = response.headers.authorization;
              }
              return response;
              // eslint-disable-next-line prefer-arrow-callback
            },
            function (error) {
              return Promise.reject(error);
            }
          );
    },
    decodeDownloadName: (effectiveFileName) => {
       effectiveFileName = decodeURIComponent(effectiveFileName);
    },
    downloadUrlDiff: (data, status, statusText) => {
        // 如果没有size长度
        if (data && data.size === 0) {
            return Promise.resolve({
                data: {
                    code: status,
                    msg: statusText,
                },
            });
        }
    }
}
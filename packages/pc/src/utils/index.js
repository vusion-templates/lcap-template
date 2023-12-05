export default {
    decodeDownloadName: (effectiveFileName) => {
       effectiveFileName = decodeURIComponent(effectiveFileName);
       return effectiveFileName
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
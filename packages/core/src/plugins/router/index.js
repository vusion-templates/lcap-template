import processService from './processService';
import { formatMicroFrontUrl, formatMicroFrontRouterPath } from './microFrontUrl';
import Config from "../../config";

export function downloadClick(realUrl, target) {
    const a = document.createElement('a');
    a.setAttribute('href', realUrl);
    a.setAttribute('target', target);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
    }, 500);
}

export default {
    install(Vue, options = {}) {
        /**
         * 流程接口注册
         */
        Vue.prototype.$process = processService;

        Vue.prototype.$formatMicroFrontUrl = formatMicroFrontUrl;
        Vue.prototype.$formatMicroFrontRouterPath = formatMicroFrontRouterPath;

        Vue.prototype.$destination = function(...args) {
          Config.destination.call(this, ...args);
        };

        Vue.prototype.$link = async function (url, target = '_self') {
            let realUrl;
            if (typeof url === 'function') {
                realUrl = await url();
            } else {
                realUrl = url;
            }
            downloadClick(realUrl, target);
        };
    },
};

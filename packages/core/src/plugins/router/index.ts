import {
  formatMicroFrontUrl,
  formatMicroFrontRouterPath,
} from '@lcap/basic-template'

import Config from "../../config";

export default {
    install(Vue, options = {}) {
        Vue.prototype.$formatMicroFrontUrl = formatMicroFrontUrl;
        Vue.prototype.$formatMicroFrontRouterPath = formatMicroFrontRouterPath;

        Vue.prototype.$destination = function (...args) {
            Config.router?.destination?.call(this, ...args);
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
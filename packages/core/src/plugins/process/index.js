import processService from './processService';
import { initService as initProcessV2Service } from "../../apis/processV2";
import { initService as initSystemProcessV2Service } from "../../apis/system/processV2";

export default {
    install(Vue, options = {}) {
        /**
         * 流程接口注册
         */
        Vue.prototype.$process = processService;
        Vue.prototype.$processV2 = initProcessV2Service();
        Vue.prototype.$systemProcessV2 = initSystemProcessV2Service();
    },
};

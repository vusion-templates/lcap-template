import {
  processService,
  initProcessV2Service,
  initSystemProcessV2Service
} from '@lcap/basic-template';

export default {
  install(Vue, options) {
    /**
     * 流程接口注册
     */
    Vue.prototype.$process = processService;
    Vue.prototype.$processV2 = initProcessV2Service();
    Vue.prototype.$systemProcessV2 = initSystemProcessV2Service();
  }
}
import { initProcessV2Service, initSystemProcessV2Service } from '../../apis';

import Global from "../../global";
import processService from './processService';

export function initProcess() {
  /**
   * 流程接口注册
   */
  Global.prototype.$process = processService;
  Global.prototype.$processV2 = initProcessV2Service();
  Global.prototype.$systemProcessV2 = initSystemProcessV2Service();
}

export { processPorts } from './processPorts';
export {
  processService,
}
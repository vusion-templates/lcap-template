import { initService as processV2Service } from "./processV2";
import { initService as systemProcessV2Service } from "./system/processV2";
import Global from "../../global";

function initProcess() {
  /**
   * 流程接口注册
   */
  Global.prototype.$processV2 = processV2Service();
  Global.prototype.$systemProcessV2 = systemProcessV2Service();
}

export {
  initProcess
}
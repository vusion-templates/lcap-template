import processService from "./processService";

import Global from "../../global";

function initProcess() {
  /**
   * 流程接口注册
   */
  Global.prototype.$process = processService;

  return {
    process: processService,
  }
}

export {
  initProcess
}
import { initService as initProcessService } from "../../apis/process";
import authService from "../auth/authService";

let user;
export default {
  async getTasks(param: {
    query?: any
  } = {}) {
    const userInfo = await authService.getUserInfo();
    user = userInfo?.UserName;
    const { query } = param;
    const res = await initProcessService().getTasks({
      query: {
        ...query,
        user,
      },
    });
    return res;
  },
  async claimTask(param: {
    path?: any
  } = {}) {
    const { path = {} } = param;
    const res = await initProcessService().claimTask({
      path: { ...path },
      body: {
        user,
      },
    });
    return res;
  },
  async getDestinationUrl(param: {
    path?: any
  } = {}) {
    const {
      path: { id },
    } = param;
    const res = await initProcessService().getDestinationUrl({
      path: { id },
      query: {
        user,
      },
    });
    return res;
  },
};

export const porcessPorts = {
  async getProcessDefinitionList(query) {
    const res = await initProcessService().getProcessDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessDefinition(query) {
    const res = await initProcessService().getProcessDefinition({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessInstanceList(query) {
    const res = await initProcessService().getProcessInstanceList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessInstance(query) {
    const res = await initProcessService().getProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDefinitionList(query) {
    const res = await initProcessService().getTaskDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDefinition(query) {
    const res = await initProcessService().getTaskDefinition({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstanceList(query) {
    const res = await initProcessService().getTaskInstanceList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstanceListV2(query) {
    const res = await initProcessService().getTaskInstanceListV2({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstance(query) {
    const res = await initProcessService().getTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstanceV2(query) {
    const res = await initProcessService().getTaskInstanceV2({
      body: {
        ...query,
      },
    });
    return res;
  },
  async claimTaskInstance(query) {
    const res = await initProcessService().claimTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async unclaimTaskInstance(query) {
    const res = await initProcessService().unclaimTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDestinationUrl(query) {
    const res = await initProcessService().getTaskDestinationUrl({
      body: {
        ...query,
      },
    });
    return res;
  },
  async transferTaskInstance(query) {
    const res = await initProcessService().transferTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async withdrawProcessInstance(query) {
    const res = await initProcessService().withdrawProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async endProcessInstance(query) {
    const res = await initProcessService().endProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getRejectableTaskDefinitionList(query) {
    const res = await initProcessService().getRejectableTaskDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async setProcessDefinitionState(query) {
    const res = await initProcessService().setProcessDefinitionState({
      body: {
        ...query,
      },
    });
    return res;
  },
  async updateTaskDefinitionStrategy(query) {
    const res = await initProcessService().updateTaskDefinitionStrategy({
      body: {
        ...query,
      },
    });
    return res;
  },
};

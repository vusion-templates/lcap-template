import { initService as processInitService } from "../../apis/process";
import authService from "../auth/authService";

let user;
export default {
  async getTasks(param = {}) {
    const userInfo = (await authService.getUserInfo()) || {};
    user = userInfo.UserName;
    const { query } = param;
    const res = await processInitService().getTasks({
      query: {
        ...query,
        user,
      },
    });
    return res;
  },
  async claimTask(param = {}) {
    const { path = {} } = param;
    const res = await processInitService().claimTask({
      path: { ...path },
      body: {
        user,
      },
    });
    return res;
  },
  async getDestinationUrl(param = {}) {
    const {
      path: { id },
    } = param;
    const res = await processInitService().getDestinationUrl({
      path: { id },
      query: {
        user,
      },
    });
    return res;
  },
  // 获取任务节点表单数据
  async getTaskInstanceForm(param = {}) {
    // const res = await processInitService().getTaskInstanceForm({
    //   body: {
    //     ...param,
    //   },
    // });
    // return res;
    return {
      userName: 'zzz',
      phone: '123456789',
      email: '111111@qq.com',
    }
  },
  // 获取任务节点表单字段权限
  async fieldPermissionDetail(param = {}) {
    // const res = await processInitService().fieldPermissionDetail({
    //   body: {
    //     ...param,
    //   },
    // });
    // return res;
    return [
      {
        propertyName: 'userName',
        permission: 'hide'
      },
      {
        propertyName: 'phone',
        permission: 'editable'
      },
      {
        propertyName: 'email',
        permission: 'readOnly'
      }
    ];
  },
  // 获取任务节点表单定义
  async getProcessFormDefinition(param = {}) {
    // const res = await processInitService().getProcessFormDefinition({
    //   body: {
    //     ...param,
    //   },
    // });
    // return res;
    return '<u-form :ref="`form_4`" :id="`dynamicRenderContainer`" key="form_4">\n    <u-form-item :ref="`form_item_6`" required="" :rules="[{validate: \'required\',message: `表单项不得为空`,trigger: \'input+blur\',required: true}]"\n        :layout="`center`">\n        <template #label :ref="`template_10`">\n            <u-text :ref="`text_10`" :text="`用户名`"></u-text>\n        </template>\n        <u-input :ref="`input_4`" :placeholder="`请输入用户名`" :value.sync="processDetailFormData.userName"></u-input>\n    </u-form-item>\n    <u-form-item :ref="`form_item_7`" :layout="`center`">\n        <template #label :ref="`template_11`">\n            <u-text :ref="`text_11`" :text="`手机号`"></u-text>\n        </template>\n        <u-input :ref="`input_5`" :placeholder="`请输入手机号`" :value.sync="processDetailFormData.phone"></u-input>\n    </u-form-item>\n    <u-form-item :ref="`form_item_8`" :layout="`center`">\n        <template #label :ref="`template_12`">\n            <u-text :ref="`text_12`" :text="`邮箱`"></u-text>\n        </template>\n        <u-input :ref="`input_6`" :placeholder="`请输入邮箱`" :value.sync="processDetailFormData.email"></u-input>\n    </u-form-item>\n</u-form>'
  },

};

export const porcessPorts = {
  async getProcessDefinitionList(query) {
    const res = await processInitService().getProcessDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessDefinition(query) {
    const res = await processInitService().getProcessDefinition({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessInstanceList(query) {
    const res = await processInitService().getProcessInstanceList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getProcessInstance(query) {
    const res = await processInitService().getProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDefinitionList(query) {
    const res = await processInitService().getTaskDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDefinition(query) {
    const res = await processInitService().getTaskDefinition({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstanceList(query) {
    const res = await processInitService().getTaskInstanceList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskInstance(query) {
    const res = await processInitService().getTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async claimTaskInstance(query) {
    const res = await processInitService().claimTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async unclaimTaskInstance(query) {
    const res = await processInitService().unclaimTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getTaskDestinationUrl(query) {
    const res = await processInitService().getTaskDestinationUrl({
      body: {
        ...query,
      },
    });
    return res;
  },
  async transferTaskInstance(query) {
    const res = await processInitService().transferTaskInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async withdrawProcessInstance(query) {
    const res = await processInitService().withdrawProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async endProcessInstance(query) {
    const res = await processInitService().endProcessInstance({
      body: {
        ...query,
      },
    });
    return res;
  },
  async getRejectableTaskDefinitionList(query) {
    const res = await processInitService().getRejectableTaskDefinitionList({
      body: {
        ...query,
      },
    });
    return res;
  },
  async setProcessDefinitionState(query) {
    const res = await processInitService().setProcessDefinitionState({
      body: {
        ...query,
      },
    });
    return res;
  },
  async updateTaskDefinitionStrategy(query) {
    const res = await processInitService().updateTaskDefinitionStrategy({
      body: {
        ...query,
      },
    });
    return res;
  },
};

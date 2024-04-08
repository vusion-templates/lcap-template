import Vue from 'vue';
import Modal from './ui/components/u-modal.vue/index';
// 引入ui样式
import './ui/styles/base.css';
// 引入ui组件
Vue.use(Modal);

export { default as SToast } from './s-toast.vue';

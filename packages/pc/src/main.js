// 修改该文件时，需要同步修改 source/icestark/main.js 和 source/qiankun/main.js
import metaData from './metaData.js';
import platformConfig from './platform.config.json';
import { routes } from './router/routes';
import cloudAdminDesigner from './init';
import './library';

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

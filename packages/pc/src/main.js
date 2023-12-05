// 修改该文件时，需要同步修改 source/icestark/main.js 和 source/qiankun/main.js
import metaData from './metaData.json';
import platformConfig from './platform.config.json';
import { routes } from '@lcap/core-template';
import './library';
import cloudAdminDesigner from './init';

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

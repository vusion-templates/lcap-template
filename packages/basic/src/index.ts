import './types/global';

import Config, { setConfig } from './config';

import {
  initAuthService,
  initConfigurationService,
  initIoService,
  initLowauthService,
  initProcessService,
} from './apis'

import {
  initAuth,
  initDataTypes,
  initLogic,
  initProcess,
  initRouter,
  initService,
  initUtils,

  downloadClick,
} from './init'

import {
  findNoAuthView,
  filterAuthResources,
  microFrontend,
  userInfoGuard,
} from './router'

import Global from './global'

export {
  Config,
  setConfig,
  initAuthService,
  initConfigurationService,
  initIoService,
  initLowauthService,
  initProcessService,
  initAuth,
  initDataTypes,
  initLogic,
  initProcess,
  initRouter,
  initService,
  initUtils,
  findNoAuthView,
  filterAuthResources,
  microFrontend,
  userInfoGuard,
  Global,
  downloadClick,
};

export * from './utils'
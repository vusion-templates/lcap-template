import './types/global';

import Config, { setConfig } from './config';

import {
  initAuthService,
  initConfigurationService,
  initIoService,
  initLowauthService,
  initProcessService,
} from './apis'

export * from './init'

import {
  findNoAuthView,
  filterAuthResources,
  microFrontend,
  userInfoGuard,
} from './router'

import Global, { global } from './global'

export {
  Config,
  setConfig,
  initAuthService,
  initConfigurationService,
  initIoService,
  initLowauthService,
  initProcessService,

  findNoAuthView,
  filterAuthResources,
  microFrontend,
  userInfoGuard,
  Global,
  global,
};

export * from './utils'
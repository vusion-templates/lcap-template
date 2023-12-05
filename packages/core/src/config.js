// 差异性配置，由H5\PC端启动时 传入覆盖
const Config = {
  $global: {},
  Toast: {
    show: (message, stack) => void 0,
    error: (message, stack) => void 0,
  },
  getFrontendVariables: (options) => {
    return {
      frontendVariables: {},
      localCacheVariableSet: new Set(),
    };
  },
  destination: () => void 0,
  createRouter: ({ routes, VueRouter }) => void 0,
  getTitleGuard: (appConfig) => (to, from, next) => void 0,
  utils: {}
};

export function setConfig(newConfig) {
  Object.assign(Config, newConfig);
}

export function getConfig() {
  return Config;
}

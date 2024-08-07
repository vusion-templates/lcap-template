import { setConfig as setBasicConfig } from '@lcap/basic-template';

interface IConfig {
  $global: Record<string, any>;
  toast: {
    show: (message: string, stack: string) => void;
    error: (message: string, stack: string) => void;
  };
  axios?: {
    interceptors: any[];
  };
  router: {
    createRouter: (options: any) => void;
    destination: (url: string, target: string) => void;
  };
  setGlobal?: (o: any) => void; 
  getFrontendVariables?: (options: any) => any
}

// 差异性配置，由H5、PC端启动时 传入覆盖
const Config: IConfig = {
  $global: {},
  toast: {
    show: (message, stack) => void 0,
    error: (message, stack) => void 0,
  },
  axios: {
    interceptors: []
  },
  router: {
    createRouter: () => void 0,
    destination: () => void 0,
  },
};

export function setConfig(newConfig) {
  Object.assign(Config, newConfig);

  setBasicConfig({
    ...Config,
  });
}

export function getConfig() {
  return Config;
}

export default Config;
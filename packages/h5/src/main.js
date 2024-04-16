import '@lcap/mobile-ui/dist-theme/index.css';
import { routes } from './router/routes';

import metaData from './metaData.js';
import platformConfig from './platform.config.json';
import './library';
import cloudAdminDesigner from './init';

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

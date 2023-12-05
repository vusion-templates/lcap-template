import '@lcap/mobile-ui/dist-theme/index.css';
import { routes } from '@lcap/core-template';

import metaData from './metaData.json';
import platformConfig from './platform.config.json';
import cloudAdminDesigner from './init';

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

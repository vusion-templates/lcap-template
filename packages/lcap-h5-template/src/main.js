import '@lcap/mobile-ui/dist-theme/index.css';

import metaData from './metaData.json';
import platformConfig from './platform.config.json';
import { routes } from '@lcap/base-core/router/routes';
import cloudAdminDesigner from './init';

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);

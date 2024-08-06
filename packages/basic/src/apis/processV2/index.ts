import merge from 'lodash/merge';

import { createService } from "../../utils/create";
import apiConfig from './api.config';
import api from './api.json';

type Service<API> = {
  [key in keyof API]: (params?: any) => Promise<any>
};

const initService = () => createService(merge(api, apiConfig)) as Service<typeof api>;

export {
    initService,
};


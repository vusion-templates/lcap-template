import { createService } from '../../utils/create';
import api from './api.json';

const initService = () => createService(api);

export {
    initService,
};

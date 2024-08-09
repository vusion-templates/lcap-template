import isPlainObject from 'lodash/isPlainObject';
import { createService } from '@lcap/basic-template';

export default {
    install(Vue, options: Record<string, any> = {}) {
        const services = Object.assign({}, options.servicesMap);
        const keys = Object.keys(services);
        keys.forEach((key) => {
            if (Vue.prototype.$services && Vue.prototype.$services[key]) {
                throw new Error('services repeat:' + key);
            }
            const service = services[key];
            if (isPlainObject(service)) {
                services[key] = createService(service);
            }
        });
        if (keys.length) {
            Vue.prototype.$services = Object.assign({}, Vue.prototype.$services, services);
            window.$services = Object.assign({}, Vue.prototype.$services, services);
        }
    },
};

import { setConfig } from '@lcap/template-core';
import { VanToast as Toast } from '@lcap/mobile-ui';

import { destination } from './plugins/router';
import { getFrontendVariables, $global } from './plugins/dataTypes';
import { createRouter } from './router';
import { getTitleGuard } from './router';

// 设置core config
setConfig({
    $global,
    getFrontendVariables,
    destination,
    createRouter,
    getTitleGuard,
    Toast: {
        show: (message, stack) => {
            Toast({
                message,
                position: 'top',
            });
        },
        error: (message, stack) => {
            Toast.fail({
                message,
                position: 'top',
            });
        },
    },
});

import { VanToast as Toast } from '@lcap/mobile-ui';
import { fromStringBase } from '@lcap/base-core/plugins/dataTypes/tools'

export const fromString = (variable, typeKey) => {
    fromStringBase(variable, typeKey)
    toastAndThrowError(`${typeName}格式不正确`);
};

export function toastAndThrowError(err) {
    // 全局提示toast
    Toast?.({
        message: err,
        position: 'top',
    });
    throw new Error(err);
}


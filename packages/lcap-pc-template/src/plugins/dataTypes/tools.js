
import { UToast } from 'cloud-ui.vusion';
import { fromStringBase } from '@lcap/base-core/plugins/dataTypes/tools'

export const fromString = (variable, typeKey) => {
    fromStringBase(variable, typeKey);
    toastAndThrowError(`${typeName}格式不正确`);
};
export function toastAndThrowError(err) {
    // 全局提示toast
    UToast?.error(err);
    throw new Error(err);
}

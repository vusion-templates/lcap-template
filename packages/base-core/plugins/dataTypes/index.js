import { Decimal } from 'decimal.js';
import CryptoJS from 'crypto-js';
import { initService as configurationInitService } from '../../apis/configuration';
import { initService as lowauthInitService } from '../../apis/lowauth';
import { initService as ioInitService } from '../../apis/io';

const aesKey = ';Z#^$;8+yhO!AhGo';

export const globalUtils = {
    // 加
    add(x, y) {
        if (typeof x !== 'number' || typeof y !== 'number') {
            return x + y;
        }
        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }
        const xx = new Decimal(x + '');
        const yy = new Decimal(y + '');
        return xx.plus(yy).toNumber();
    },
    // 减
    minus(x, y) {
        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }
        const xx = new Decimal(x + '');
        const yy = new Decimal(y + '');
        return xx.minus(yy).toNumber();
    },
    // 乘
    multiply(x, y) {
        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }
        const xx = new Decimal(x + '');
        const yy = new Decimal(y + '');
        return xx.mul(yy).toNumber();
    },
    // 除
    divide(x, y) {
        if (!x) {
            x = 0;
        }
        if (!y) {
            y = 0;
        }
        const xx = new Decimal(x + '');
        const yy = new Decimal(y + '');
        return xx.div(yy).toNumber();
    },
    // 相等
    isEqual(x, y) {
        // eslint-disable-next-line eqeqeq
        return x == y;
    },
    requestFullscreen() {
        return document.body.requestFullscreen();
    },
    exitFullscreen() {
        return document.exitFullscreen();
    },
    /**
     * 比较键盘事件
     * @param {KeyboardEvent} event
     * @param {String[]} target
     */
    compareKeyboardInput(event, target) {
        // 将target转event
        const targetEvent = { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, code: '' };
        target.forEach((item) => {
            if (item === 'Alt') {
                targetEvent.altKey = true;
            } else if (item === 'Meta') {
                targetEvent.metaKey = true;
            } else if (item === 'Control') {
                targetEvent.ctrlKey = true;
            } else if (item === 'Shift') {
                targetEvent.shiftKey = true;
            } else {
                targetEvent.code = item;
            }
        });

        let isMatch = true;
        for (const key in targetEvent) {
            if (Object.hasOwnProperty.call(targetEvent, key)) {
                if (targetEvent[key] !== event[key]) {
                    isMatch = false;
                }
            }
        }

        return isMatch;
    },
    encryptByAES({ string: message }, key = aesKey) {
        const keyHex = CryptoJS.enc.Utf8.parse(key); //
        const messageHex = CryptoJS.enc.Utf8.parse(message);
        const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    },
    decryptByAES({ string: messageBase64 }, key = aesKey) {
        const keyHex = CryptoJS.enc.Utf8.parse(key);
        const decrypt = CryptoJS.AES.decrypt(messageBase64, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    },
    getLocation() {
        return new Promise((res, rej) => {
            function showPosition(position) {
                const { latitude, longitude } = position.coords;
                const [mglng, mglat] = [longitude, latitude];
                res(`${mglng},${mglat}`);
            }
            function showError(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        this.$toast.show('用户禁止获取地理定位');
                        rej({ code: error.code, msg: '用户禁止获取地理定位' });
                        break;
                    case error.POSITION_UNAVAILABLE:
                        this.$toast.show('地理定位信息无法获取');
                        rej({ code: error.code, msg: '地理定位信息无法获取' });
                        break;
                    case error.TIMEOUT:
                        this.$toast.show('地理定位信息获取超时');
                        rej({ code: error.code, msg: '地理定位信息获取超时' });
                        break;
                    case error.UNKNOWN_ERROR:
                        this.$toast.show('未知错误');
                        rej({ code: error.code, msg: '未知错误' });
                        break;
                }
            }
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                this.$toast.show('当前系统不支持地理定位');
                rej({ code: 666, msg: '当前系统不支持地理定位' });
            }
        });
    },
    getDistance(s1, s2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        const lat1t = s1.split(',')[1];
        const lng1t = s1.split(',')[0];
        const lat2t = s2.split(',')[1];
        const lng2t = s2.split(',')[0];

        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2t - lat1t); // deg2rad below
        const dLon = deg2rad(lng2t - lng1t);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1t)) * Math.cos(deg2rad(lat2t)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d * 1000;
    },
    async downloadFile(url, fileName) {
        await ioInitService()
            .downloadFiles({
                body: {
                    urls: [url],
                    fileName,
                },
            })
            .then((res) => Promise.resolve(res))
            .catch((err) => Promise.resolve(err));
    },
    async downloadFiles(urls, fileName) {
        await ioInitService()
            .downloadFiles({
                body: {
                    urls,
                    fileName,
                },
            })
            .then((res) => Promise.resolve(res))
            .catch((err) => Promise.resolve(err));
    },
    async getCustomConfig(configKey = '') {
        const configKeys = configKey.split('.');
        const finalConfigKey = configKeys.pop();
        const groupName = configKeys[configKeys.length - 2];
        const query = {
            group: groupName,
        };
        if (configKey.startsWith('extensions.')) {
            query.group = `${configKeys[0]}.${configKeys[1]}.${groupName}`;
        }
        const res = await configurationInitService().getCustomConfig({
            path: { configKey: finalConfigKey },
            query,
        });
        return res;
    },
    async getCurrentIp() {
        const res = await configurationInitService().getCurrentIp();
        return res;
    },
    async getUserList(query) {
        const appEnv = window.appInfo.env;
        const cookies = document.cookie.split('; ');
        const token = cookies.find((cookie) => cookie.split('=')[0] === 'authorization')?.split('=')[1];
        const res = await lowauthInitService().getUserList({
            body: {
                appEnv,
                token,
                ...query,
            },
        });
        return res;
    },
    getUserLanguage() {
        return navigator.language || navigator.userLanguage;
    },
}

// 实体的 updateBy 和 deleteBy 需要提前处理请求参数
export function parseRequestDataType(root, _prop) {
        let value;
        try {
            // eslint-disable-next-line no-eval
            value = eval(root[_prop]);
        } catch (err) {
            value = root.value;
        }
        const type = typeof value;
        // console.log('type:', type, value)
        if (type === 'number') {
            root.concept = 'NumericLiteral';
            root.value = value + '';
        } else if (type === 'string') {
            root.concept = 'StringLiteral';
            root.value = value;
        } else if (type === 'boolean') {
            root.concept = 'BooleanLiteral';
            root.value = value;
        } else if (type === 'object') {
            if (Array.isArray(value)) {
                const itemValue = value[0];
                if (itemValue !== undefined) {
                    const itemType = typeof itemValue;
                    root.concept = 'ListLiteral';
                    if (itemType === 'number') {
                        root.value = value.map((v) => v + '').join(',');
                    } else if (itemType === 'string') {
                        root.value = value.map((v) => "'" + v + "'").join(',');
                    } else if (itemType === 'boolean') {
                        root.value = value.join(',');
                    }
                }
            }
        }
}

// 实体的 updateBy 和 deleteBy 需要提前处理请求参数
export function resolveRequestData(root) {
    if (!root) return;
    // console.log(root.concept)
    delete root.folded;

    if (root.concept === 'NumericLiteral') {
        // eslint-disable-next-line no-self-assign
        root.value = root.value;
    } else if (root.concept === 'StringLiteral') {
        // eslint-disable-next-line no-self-assign
        root.value = root.value;
    } else if (root.concept === 'NullLiteral') {
        delete root.value;
    } else if (root.concept === 'BooleanLiteral') {
        root.value = root.value === 'true';
    } else if (root.concept === 'Identifier') {
        parseRequestDataType.call(this, root, 'expression');
    } else if (root.concept === 'MemberExpression') {
        if (root.expression) {
            parseRequestDataType.call(this, root, 'expression');
        }
    }
    resolveRequestData.call(this, root.left);
    resolveRequestData.call(this, root.right);
    return root;
}

export function isLooseEqualFn(obj1, obj2, cache = new Map()) {
    // 检查对象是否相同
    if (obj1 === obj2) {
        return true;
    }
    // 对象是否已经比较过，解决循环依赖的问题
    if (cache.has(obj1) && cache.get(obj1) === obj2) {
        return true;
    }
    // 判断类型相等
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    // 判断数组长度或者对象属性数量一致
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    // 加入缓存中
    cache.set(obj1, obj2);
    // 比较属性中的每个值是否一致
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        // 递归
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!isLooseEqualFn(val1, val2, cache)) {
                return false;
            }
        } else {
            // 判断非对象的值是否一致
            if (val1 !== val2) {
                return false;
            }
        }
    }
    return true;
}

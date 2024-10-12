import { encodeUrl, downloadClick } from '@lcap/core-template';
import { navigateTo,isMiniApp } from '../common/wx';

export function destination(url, target = '_self') {
    if (!url) {
        return
    }

    // 微信小程序跳转
    if (isMiniApp) {
        if (target === '_self' && url?.startsWith('http')) {
            location.href = encodeUrl(url)
        } else {
            navigateTo({ url });
        }
        return;
    }

    if (target === '_self') {
        if (url?.startsWith('http')) {
            location.href = encodeUrl(url)
        } else {
            this.$router.push(url);
        }
    } else {
        downloadClick(url, target);
    }
}

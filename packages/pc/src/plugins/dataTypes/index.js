import Vue from 'vue';
import cookie, { authService } from '@lcap/core-template';

export default {
    hasAuth({ string: authPath }) {
        return authService.has(authPath);
    },
    logout() {
        Vue.prototype
            .$confirm({
                content: '确定退出登录吗？',
                title: '提示',
                okButton: '确定',
                cancelButton: '取消',
            })
            .then(() => Vue.prototype.$auth.logout())
            .then(() => {
                cookie.erase('authorization');
                cookie.erase('username');
                location.reload();
            });
    },
    setI18nLocale(newLocale) {
        // 修改local中的存储的语言标识
        localStorage.i18nLocale = newLocale;
        // 修改当前template的语言
        $global.i18nInfo.locale = newLocale;
        $global.i18nInfo.currentLocale = newLocale;
        // 修改当前语言名称
        $global.i18nInfo.localeName = this.getI18nList().find((item) => item.id === newLocale)?.name;
        // 调用UI库更新当前语言
        appVM.$i18n.locale = newLocale;
        // 调用UI库更新当前语言
        window.Vue.prototype.$CloudUILang = newLocale;
        // 重新加载页面
        window.location.reload();
    },
    getI18nList() {
        // 在ide中拼接好
        return $global.i18nInfo.I18nList || [];
    },
}

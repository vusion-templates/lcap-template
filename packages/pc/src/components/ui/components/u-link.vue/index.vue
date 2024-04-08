<template>
<a vusion-slot-name-edit="text" :class="$style.root"
    :target="target"
    :noDecoration="!decoration"
    :disabled="currentDisabled" :tabindex="currentDisabled ? -1 : 0"
    :download="currentDownload"
    :loading="loading || $attrs.loading"
    :hoverType="hoverType"
    v-on="$listeners">
    <template>
        <slot>{{ text }}</slot>
    </template>
</a>
</template>

<script>

export default {
    name: 'u-link',
    props: {
        icon: String,
        text: String,
        href: String,
        target: { type: String, default: '_self' },
        to: [String, Object],
        replace: { type: Boolean, default: false },
        append: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        decoration: { type: Boolean, default: true },
        download: { type: Boolean, default: false },
        destination: String,
        hoverType: { type: String, default: 'underline' },
        link: [String, Function],
        iconPosition: { type: String, default: 'left', validator: (value) => ['left', 'right'].includes(value) },
    },
    data() {
        return {
            clickEvent: this.$listeners.click || function () { /* noop */ },
            loading: false,
        };
    },
    computed: {
        currentDisabled() {
            return this.disabled || this.loading;
        },
        currentDownload() {
            if (this.download && this.href) {
                const fileName = this.href.split('/').pop();
                return fileName;
            }
        },
    },
};
</script>

<style module>
.root {
    color: var(--link-color);
}

.root:hover {
    text-decoration: underline;
}

.root[hoverType="color"]:hover {
    text-decoration: none;
    color: var(--link-color-hover);
}

.root[noDecoration] {
    text-decoration: none!important;
}

.root:focus {
    /* Remove default focus style */
    outline: var(--focus-outline);
    text-decoration: underline;
}

.root[color="success"] {
    color: var(--link-color-success);
}

.root[hoverType="color"][color="success"]:hover {
    color: var(--link-color-success-hover);
}

.root[color="warning"] {
    color: var(--link-color-warning);
}

.root[hoverType="color"][color="warning"]:hover {
    color: var(--link-color-warning-hover);
}

.root[color="error"] {
    color: var(--link-color-error);
}

.root[hoverType="color"][color="error"]:hover {
    color: var(--link-color-error-hover);
}

.root[color="danger"] {
    color: var(--link-color-danger);
}

.root[hoverType="color"][color="danger"]:hover {
    color: var(--link-color-danger-hover);
}

.root[color="light"] {
    color: var(--link-color-light);
}

.root[color="white"] {
    color: var(--link-color-white);
}

.root[disabled] {
    cursor: var(--cursor-not-allowed);
    color: var(--link-color-disabled);
    text-decoration: none;
}

.root[hoverType=color][disabled]:hover {
    color: var(--link-color-disabled);
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.root[loading]::before {
    display: inline-block;
content: "\e66b";
    font-family: "lcap-ui-icons";
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-decoration: inherit;
    text-rendering: optimizeLegibility;
    text-transform: none;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    margin-right: 4px;
    animation: spin infinite linear var(--spinner-animation-duration);
}

.root[display="block"] {
    display: block;
}

.root:lang(en) {
    display: inline-block;
    max-width: 100%;
}
</style>

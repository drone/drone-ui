<script>
function getTag(context) {
  const { to, href } = context;

  if (to) return "router-link";
  if (href) return "a";
  return "button";
}

function getProps(tag, context) {
  const { to } = context;

  if (tag === "router-link") return { to };
  return {};
}

function getDomProps(tag, context) {
  const { href, disabled } = context;

  if (tag === "a") return { href, disabled };
  return { disabled };
}

export default {
  name: "Button",
  props: {
    to: String,
    href: String,
    loading: { type: Boolean, default: false },
    borderless: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: "m", validator: val => ["m", "l"].includes(val) },
    theme: {
      type: String,
      default: "default",
      validator: val => ["default", "light", "primary", "danger"].includes(val)
    }
  },
  computed: {
    bordered() {
      return !this.borderless && this.outline;
    }
  },
  render(createElement) {
    const tag = getTag(this);
    const { bordered, outline, theme, size, loading } = this;

    return createElement(
      tag,
      {
        domProps: getDomProps(tag, this),
        class: { button: true, bordered, outline, loading, [`theme-${theme}`]: true, [`size-${size}`]: true },
        props: getProps(tag, this)
      },
      this.$slots.default
    );
  }
};
</script>

<style>
.button > span + svg,
.button > svg + span {
  margin-left: 7px;
}

.button > svg {
  width: 20px;
  height: 20px;
  opacity: 0.6;
  margin-bottom: -5px;
}

.button:focus > svg,
.button:hover > svg {
  opacity: 1;
}
</style>

<style scoped lang="scss">
@import "../../assets/styles/mixins";

.button {
  background: none;
  font-size: 14px;
  border: none;
  display: inline-block;
  text-transform: uppercase;
  cursor: pointer;
  box-sizing: border-box;
  letter-spacing: 0.5px;
  font-weight: 500;
  border-radius: 3px;
  color: #fff;

  @include mobile {
    font-size: 13px;
  }
}

.button.size-m {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
}

.button.size-l {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}

.button.bordered {
  border: 1px solid rgba($color-text, 0.25);
}

.button.bordered.size-m {
  line-height: 28px;
}

.button.bordered.size-l {
  line-height: 38px;
}

.button.theme-default {
  background-color: $color-text;
}

.button.theme-light {
  background-color: #fff;
}

.button.theme-primary {
  background-color: $color-primary;
}

.button.theme-danger {
  background-color: #ff4164;
}

.button.outline {
  background-color: transparent;
}

.button.theme-default.outline {
  color: $color-text;
}

.button.theme-light.outline {
  color: #fff;
}

.button.theme-primary.outline {
  color: $color-primary;
}

.button.theme-danger.outline {
  color: #ff4164;
}

.button:focus {
  outline: none;
}

.button.bordered:hover,
.button.bordered:focus {
  border-color: $color-primary;
}

.button.theme-default:focus,
.button.theme-default:hover {
  background-color: rgba($color-text, 0.8);
}

.button.theme-default.outline:focus,
.button.theme-default.outline:hover {
  color: $color-primary;
  background-color: transparent;
}

.button.theme-primary:focus,
.button.theme-primary:hover {
  background-color: #085cc1;
}

.button.theme-primary.outline:focus,
.button.theme-primary.outline:hover {
  background-color: rgba(5, 100, 215, $button-outline-hover-bg-opacity);
}

.button.theme-danger:focus,
.button.theme-danger:hover {
  background-color: #dd3e60;
}

.button.theme-danger.outline:focus,
.button.theme-danger.outline:hover {
  background-color: rgba(255, 65, 100, $button-outline-hover-bg-opacity);
}

.button.loading {
  color: transparent !important;
  text-align: center;
  position: relative;
  pointer-events: none;
}

.button.loading:before {
  content: "";
  display: inline-block;
  position: absolute;
  top: 50%;
  margin: -9px 0 0 -9px;
  left: 50%;
  width: 18px;
  height: 18px;
  border: 1px solid #fff;
  border-radius: 50%;
  border-bottom-color: transparent !important;
  animation: spin 1s linear infinite;
}

.button.theme-danger.outline.loading:before {
  border-color: #dd3e60;
}

.button[disabled],
.button:hover[disabled] {
  cursor: not-allowed;
  opacity: 0.25;
  border-color: rgba($color-text, 0.5);
  color: $color-text;
}
</style>

<script>
function getTag(context) {
  const { to, href } = context;

  if (to) return "router-link";
  if (href) return "a";
  return "button";
}

function getElementProps(tag, context) {
  const { to, href } = context;

  if (tag === "router-link") return { to };
  return {};
}

export default {
  name: "Button",
  props: {
    to: String,
    // todo href
    bordered: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    theme: {
      type: String,
      default: "default",
      validator: val => ["default", "default-light"].includes(val)
    }
  },
  render(createElement) {
    const tag = getTag(this);
    const { bordered, disabled } = this;
    return createElement(
      tag,
      {
        domProps: { disabled: disabled },
        class: { button: true, bordered, [`theme-${this.theme}`]: true },
        props: getElementProps(tag, this)
      },
      this.$slots.default
    );
  }
};
</script>

<style>
.button > span + svg,
.button > svg + span {
  margin-left: 10px;
}

.button > svg {
  width: 18px;
  height: 18px;
  margin-bottom: -4px;
}
</style>

<style scoped>
.button {
  background: none;
  font-size: 14px;
  border: none;
  display: inline-block;
  text-transform: uppercase;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.button > * {
  transition: color linear 0.2s;
}

.button.bordered {
  border-radius: 3px;
  line-height: 28px;
  border: 1px solid rgba(25, 45, 70, 0.25);
  color: #192d46;
  transition: border-color linear 0.2s;
}

.button.theme-default-light {
  color: rgba(255, 255, 255, 0.6);
}

.button:focus,
.button:hover {
  color: #0564d7;
  outline: none;
}

.button.bordered:hover,
.button.bordered:focus {
  border-color: #0564d7;
}

.button.theme-default-light:hover,
.button.theme-default-light:focus {
  color: #fff;
}

.button[disabled],
.button:hover[disabled] {
  cursor: not-allowed;
  opacity: 0.25;
  border-color: rgba(25, 45, 70, 0.5);
  color: #192d46;
}
</style>

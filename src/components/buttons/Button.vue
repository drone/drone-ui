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
    // kind: { type: String, default: "default" },
    bordered: { type: Boolean, default: true }
  },
  render(createElement) {
    const tag = getTag(this);
    const { bordered } = this;

    return createElement(
      tag,
      {
        class: { button: true, bordered },
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
  font-size: 13px;
  border: none;
  color: rgba(25, 45, 70, 0.25);
  display: inline-block;
  text-transform: uppercase;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
}

.button.bordered {
  border-radius: 3px;
  line-height: 28px;
  border: 1px solid rgba(25, 45, 70, 0.25);
  color: #192d46;
}

.button:focus,
.button:hover {
  color: rgba(25, 45, 70, 0.75);
  outline: none;
}

.button.bordered:hover,
.button.bordered:focus {
  border-color: transparent;
}
</style>

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
    type: String
  },
  render(createElement) {
    const tag = getTag(this);

    return createElement(
      tag,
      {
        class: "button",
        props: getElementProps(tag, this)
      },
      this.$slots.default
    );
  }
};
</script>

<style scoped>
.button {
  background: none;
  border: none;
  font-size: 13px;
  color: rgba(25, 45, 70, 0.25);
  display: inline-block;
  align-items: center;
  text-transform: uppercase;
  padding: 0;
  cursor: pointer;
}

.button:hover {
  color: rgba(25, 45, 70, 0.75);
}
</style>

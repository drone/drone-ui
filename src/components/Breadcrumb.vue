<script>
import IconArrow from "@/components/icons/IconArrow";

export default {
  name: "Breadcrumb",
  components: {
    IconArrow
  },
  render(createElement) {
    const items = [];
    const slotItems = this.$slots.default;

    for (let i = 0; i < slotItems.length; ++i) {
      if (i !== 0 && slotItems[i].tag) {
        const divider = createElement(IconArrow, { class: "divider", props: { direction: "right" } });
        items.push(divider);
      }

      items.push(slotItems[i]);
    }

    return createElement("div", { class: "breadcrumbs" }, items);
  }
};
</script>

<style scoped>
.breadcrumbs {
  padding: 5px 0;
}

.breadcrumbs .divider {
  padding: 0 8px;
  color: rgba(25, 45, 70, 0.6);
  vertical-align: bottom;
}
</style>

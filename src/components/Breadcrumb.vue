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
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 30px;
  padding: 5px 0;
}

.breadcrumbs .divider {
  padding: 0 10px;
  color: rgba(25, 45, 70, 0.6);
}
</style>

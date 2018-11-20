<script>
export default {
  name: "Breadcrumb",
  render(createElement) {
    const items = [];
    const slotItems = this.$slots.default;

    for (let i = 0; i < slotItems.length; ++i) {
      if (i !== 0 && slotItems[i].tag) {
        const divider = createElement("span", { class: "divider" }, "/");
        items.push(divider);
      }

      items.push(slotItems[i]);
    }

    return createElement("div", { class: "breadcrumbs" }, items);
  }
};
</script>

<style>
.breadcrumbs {
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 30px;
  padding: 5px 0;
}

.breadcrumbs .divider {
  padding: 0 10px;
  color: rgba(25, 45, 70, 0.25);
}
</style>

<style scoped>
.slot {
  height: 24px;
  display: flex;
  align-items: center;
}
</style>

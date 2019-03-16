<script>
import IconArrow from "@/components/icons/IconArrow";

const BREADCRUMB_CLASS = "breadcrumb";

export default {
  name: "Breadcrumb",
  components: {
    IconArrow
  },
  methods: {
    insertClassToSlotItem(slotItem) {
      slotItem.data = slotItem.data || {};

      if (slotItem.data.staticClass) {
        slotItem.data.staticClass += " " + BREADCRUMB_CLASS;
      } else {
        slotItem.data.staticClass = BREADCRUMB_CLASS;
      }
    }
  },
  render(createElement) {
    const items = [];
    const slotItems = this.$slots.default.filter(item => item.tag);

    for (let i = 0; i < slotItems.length; ++i) {
      this.insertClassToSlotItem(slotItems[i]);

      const breadcrumbContainer = createElement("div", { class: "breadcrumb-container" }, [
        slotItems[i],

        i + 1 < slotItems.length
          ? createElement(IconArrow, { class: "divider", props: { direction: "right" } })
          : undefined
      ]);

      items.push(breadcrumbContainer);
    }

    return createElement("div", { class: "breadcrumbs" }, items);
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.breadcrumbs {
  padding: 5px 0;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.breadcrumb-container {
  white-space: nowrap;
  vertical-align: top;
  max-width: 100%;
  display: flex;
}

.breadcrumb {
  overflow: hidden;
  text-overflow: ellipsis;
}

.divider {
  padding: 0 8px;
  color: $color-text-secondary;
  vertical-align: bottom;
}
</style>

<template>
  <div class="user-menu-section">
    <div>
      <slot></slot>
    </div>
    <div v-if="this.$slots.right" class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "UserMenuSection"
};
</script>

<style scoped lang="scss">
.user-menu-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  div.right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>

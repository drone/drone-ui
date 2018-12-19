<template>
  <div class="page-header">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 15px;

  @include mobile {
    height: 70px;
    padding: 0 10px;
  }
}
</style>

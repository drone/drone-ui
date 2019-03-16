<template>
  <span class="tag"><slot></slot></span>
</template>

<style scoped lang="scss">
@import "../assets/styles/variables";

span {
  display: inline-block;
  background: rgba($color-text, 0.03);
  color: $color-text-secondary;
  font-size: 11px;
  text-transform: uppercase;
  padding: 0 10px;
  line-height: 24px;
  border-radius: 2px;
}
</style>

<template>
  <span class="tag"><slot></slot></span>
</template>

<style scoped lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

span {
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  padding: 0 10px;
  line-height: 24px;
  border-radius: 2px;
  @include themed {
    color: tget("color-text-secondary");
  }
  @include themed-only(default) {
    background: rgba(tget("color-text"), 0.03);
  }
  @include themed-only(dark) {
    background: rgba(tget("color-text"), 0.07);
  }
}
</style>

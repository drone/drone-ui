<template>
  <span style="display: none"></span>
</template>

<script>
let count = 0;

export default {
  name: "ScrollLock",
  mounted() {
    count += 1;
    document.documentElement.classList.add("scroll-locked");
  },
  destroyed() {
    count -= 1;
    if (count === 0) {
      document.documentElement.classList.remove("scroll-locked");
    }
  }
};
</script>

<style>
html.scroll-locked,
html.scroll-locked body {
  height: 100%;
  overflow: hidden;
}
</style>

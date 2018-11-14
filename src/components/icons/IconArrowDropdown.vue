<template>
  <svg viewBox="0 0 14 8" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
      <path d="M1 1l5.859 5.859a.2.2 0 0 0 .282 0L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconArrow",
  props: {
    direction: String // todo
  }
};
</script>

<style scoped>
svg {
  width: 12px;
  height: 6px;
}
</style>

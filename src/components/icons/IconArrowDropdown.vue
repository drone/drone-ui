<template>
  <svg viewBox="0 0 15 8" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.182.535a.726.726 0 0 1 .968 0 .596.596 0 0 1 0 .891L7.983 7.11a.95.95 0 0 1-1.266 0L.55 1.426a.596.596 0 0 1 0-.891.726.726 0 0 1 .968 0L7.35 5.908 13.182.535z"
      fill="currentColor" fill-rule="nonzero"/>
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
  width: 15px;
  height: 8px;
}
</style>

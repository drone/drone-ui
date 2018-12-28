<template>
  <svg viewBox="0 0 14 8"
       xmlns="http://www.w3.org/2000/svg"
       :class="{ [`direction-${direction}`]: true, 'icon-arrow-dropdown': true }">
    <g fill="none" fill-rule="evenodd">
      <path
        d="M7 6.352L12.832.211a.66.66 0 0 1 .968 0 .748.748 0 0 1 0 1.019L7.633 7.724a.863.863 0 0 1-1.266 0L.2 1.23A.748.748 0 0 1 .2.211a.66.66 0 0 1 .968 0L7 6.352z"
        fill="currentColor" fill-rule="nonzero"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconArrow",
  props: {
    direction: String
  }
};
</script>

<style scoped>
svg {
  width: 14px;
  height: 8px;
}

.direction-right {
  transform: rotate(-90deg);
}
</style>

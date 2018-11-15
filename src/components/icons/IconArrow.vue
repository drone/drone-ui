<template>
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 17 8"
       class="icon-arrow"
       :class="{ [`direction-${direction}`]: true }">
    <g fill="none" fill-rule="evenodd">
      <g fill-rule="nonzero" stroke="currentColor" stroke-linecap="round">
        <path d="M.5 4h15M12.5 0l3.859 3.859a.2.2 0 0 1 0 .282L12.5 8"/>
      </g>
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
.icon-arrow {
  width: 18px;
  height: 18px;
}

.direction-left {
  transform: rotate(180deg);
}

.direction-down {
  transform: rotate(90deg);
}
</style>

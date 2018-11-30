<template>
  <svg viewBox="0 0 10 19"
       xmlns="http://www.w3.org/2000/svg"
       class="icon-arrow"
       :class="{ [`direction-${direction}`]: true }">
    <g fill="currentColor" fill-rule="nonzero">
      <path d="M5.65 1.5a.65.65 0 1 0-1.3 0v15a.65.65 0 1 0 1.3 0v-15z"/>
      <path
        d="M1.46 13.04a.65.65 0 1 0-.92.92L4.4 17.818a.85.85 0 0 0 1.202 0L9.46 13.96a.65.65 0 1 0-.92-.92L5 16.58l-3.54-3.54z"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconArrow",
  props: {
    direction: {
      type: String,
      default: "down",
      validator: value => ["up", "down", "right", "left"].includes(value)
    }
  }
};
</script>

<style scoped>
.icon-arrow {
  width: 19px;
  height: 19px;
}

.direction-left {
  transform: rotate(90deg);
}

.direction-right {
  transform: rotate(-90deg);
}

.direction-up {
  transform: rotate(180deg);
}
</style>

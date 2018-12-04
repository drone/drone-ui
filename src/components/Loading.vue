<template>
  <div class="loading">
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    text: { type: String, default: "Loading" }
  }
};
</script>

<style>
.loading {
  text-align: center;
}

.loading:after {
  position: absolute;
  overflow: hidden;
  display: inline-block;
  animation: ellipsis steps(4, end) 1s infinite;
  content: "...";
  width: 0;
  text-align: left;
}

@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>

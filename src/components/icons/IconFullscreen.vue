<template>
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="icon-fullscreen">
    <g fill="none" fill-rule="evenodd">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="close" d="M14.76 6.413H9.588V1.24M1.24 9.587h5.173v5.174M9.587 6.413L15.5.5M6.413 9.587L.5 15.5"/>
        <path v-else d="M10.326.5H15.5v5.174M5.674 15.5H.5v-5.174M15.5.5L9.587 6.413M.5 15.5l5.913-5.913"/>
      </g>
    </g>
  </svg>
</template>


<script>
export default {
  name: "IconFullscreen",
  props: {
    close: Boolean
  }
};
</script>

<style scoped>
.icon-fullscreen {
  width: 16px;
  height: 16px;
}
</style>

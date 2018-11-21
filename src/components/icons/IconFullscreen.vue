<template>
  <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class="icon-fullscreen">
    <g fill="none" fill-rule="evenodd">
      <g v-if="close" fill-rule="nonzero">
        <path d="M0 0h18v18H0z"/>
        <g fill="currentColor">
          <path
            d="M15.76 6.763a.65.65 0 1 1 0 1.3h-5.173a.65.65 0 0 1-.65-.65V2.24a.65.65 0 1 1 1.3 0v4.524h4.524zM6.763 11.237H2.24a.65.65 0 1 1 0-1.3h5.174a.65.65 0 0 1 .65.65v5.174a.65.65 0 1 1-1.3 0v-4.524z"/>
          <path
            d="M11.047 7.873a.65.65 0 1 1-.92-.92L16.04 1.04a.65.65 0 1 1 .92.92l-5.913 5.913zM6.953 10.127a.65.65 0 0 1 .92.92L1.96 16.96a.65.65 0 1 1-.92-.92l5.913-5.913z"/>
        </g>
      </g>

      <g v-else fill-rule="nonzero" transform="translate(1,1)">
        <path d="M-1-1h18v18H-1z"/>
        <g fill="currentColor">
          <path
            d="M10.326 1a.5.5 0 1 1 0-1H15.5a.5.5 0 0 1 .5.5v5.174a.5.5 0 1 1-1 0V1h-4.674zM1 15h4.674a.5.5 0 1 1 0 1H.5a.5.5 0 0 1-.5-.5v-5.174a.5.5 0 1 1 1 0V15z"/>
          <path
            d="M15.146.147a.5.5 0 1 1 .707.707L9.94 6.767a.5.5 0 0 1-.707-.707L15.146.147zM.854 15.853a.5.5 0 1 1-.707-.707L6.06 9.233a.5.5 0 0 1 .707.707L.854 15.853z"/>
        </g>
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
  width: 18px;
  height: 18px;
}
</style>

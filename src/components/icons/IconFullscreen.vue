<template>
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"
       stroke-linejoin="round" stroke-miterlimit="1.414">
    <!-- close fullscreen -->
    <path v-if="close"
      d="M6.903 12.205H3.602a.603.603 0 0 1 0-1.205h4.796c.332 0 .602.27.602.602v4.796a.603.603 0 0 1-1.205 0v-3.301l-4.718 4.718a.63.63 0 1 1-.892-.892l4.718-4.718zm5.302-5.302l4.718-4.718a.63.63 0 1 1 .892.892l-4.718 4.718h3.301a.603.603 0 0 1 0 1.205h-4.796A.603.603 0 0 1 11 8.398V3.602a.603.603 0 0 1 1.205 0v3.301z"
      fill="currentColor" fill-rule="nonzero"/>

    <!-- open fullscreen -->
    <path v-else
      d="M3.205 15.903l4.718-4.718a.63.63 0 1 1 .892.892l-4.718 4.718h3.301a.603.603 0 0 1 0 1.205H2.602A.603.603 0 0 1 2 17.398v-4.796a.603.603 0 0 1 1.205 0v3.301zM15.903 3.205h-3.301a.603.603 0 0 1 0-1.205h4.796c.332 0 .602.27.602.602v4.796a.603.603 0 0 1-1.205 0V4.097l-4.718 4.718a.63.63 0 1 1-.892-.892l4.718-4.718z"
      fill="currentColor" fill-rule="nonzero"/>
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

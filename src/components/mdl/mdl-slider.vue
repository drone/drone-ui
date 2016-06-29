<script>
export default {
  ready () {
    componentHandler.upgradeElements(this.$el)
  }
}
</script>

<template>
  <input class="mdl-slider mdl-js-slider" type="range" min="0" max="100" value="25" tabindex="0">
</template>

<style>
.mdl-slider__background-flex {
  height:10px;
  border-radius: 5px;
}

.mdl-slider__background-lower {
  background: #00BFA5;
}

.mdl-slider__background-upper {
  background: #BDBDBD;
  opacity: 0.5;
}

input[type=range]::-ms-thumb {
  background: #00BFA5 !important;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px !important;
  width: 18px !important;
  margin-top: 5px;
  background: #00BFA5 !important;
}

input[type=range]::-moz-range-thumb {
  -moz-appearance: none;
  height: 18px !important;
  width: 18px !important;
  background: #00BFA5 !important;
}
</style>

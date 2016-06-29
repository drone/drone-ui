<script>
export default {
  ready () {
    componentHandler.upgradeElements(this.$el)
  }
}
</script>

<template>
  <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['displayOn'],
  ready () {
    componentHandler.upgradeElements(this.$el, 'MaterialSnackbar')
    this.$on(this.displayOn, (snackarConfig) => {
      this.$el.MaterialSnackbar.showSnackbar(snackarConfig)
    })
  }
}
</script>

<template>
  <div class="mdl-js-snackbar mdl-snackbar">
    <div class="mdl-snackbar__text"></div>
    <button class="mdl-snackbar__action" type="button"></button>
  </div>
</template>

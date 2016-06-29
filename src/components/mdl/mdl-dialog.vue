<script>
export default {
  ready () {
    componentHandler.upgradeElements(this.$el)
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
      this.$emit('open')
    },
    close () {
      this.show = false
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div v-show="show" class="mdl-dialog-wrapper">
    <dialog class="mdl-dialog">
      <h3 class="mdl-dialog__title">
        <slot name="title"></slot>
      </h3>
      <div class="mdl-dialog__content">
        <slot></slot>
      </div>
      <div class="mdl-dialog__actions">
        <slot name="actions"></slot>
      </div>
    </dialog>
  </div>
</template>

<style>
.mdl-dialog-wrapper {
  z-index: 99999;
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content:center;
  -webkit-justify-content:center;
  background: rgba(0,0,0,0.3);
}

.mdl-dialog {
  display: block;
  min-width: 280px;
  position:relative;
}
</style>

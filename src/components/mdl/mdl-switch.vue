<script>
export default {
  ready () {
    componentHandler.upgradeElements(this.$el)
  }
}
</script>

<template>
  <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
    <input type="checkbox" class="mdl-switch__input" checked>
    <span class="mdl-switch__label">
      <slot></slot>
    </span>
  </label>
</template>

<style lang="less">
.mdl-switch__thumb {
  box-shadow: none;
}

.mdl-switch {
  .mdl-switch__thumb {
    box-shadow: none;
    background: #BDBDBD;
  }

  .mdl-switch__track {
    background: #BDBDBD;
    opacity: 0.5;
  }
}

.mdl-switch.is-checked {
  .mdl-switch__thumb {
    box-shadow: none;
    background: #00BFA5;
  }

  .mdl-switch__track {
    background: #00BFA5;
    opacity: 0.5;
  }
}
</style>

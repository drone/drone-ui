<template>
  <div class="panel" :class="{ [`side-${side}`]: true, [`opened-${opened ? 'yes' : 'no'}`]: true }">
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

export default {
  name: "Panel",
  props: {
    name: { type: String, required: true },
    side: { type: String, required: true, validator: validators.oneOf(["right", "left"]) },
    opened: { type: Boolean, default: false }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.panel {
  width: 360px;
  overflow: hidden;
  flex-shrink: 0;
  display: none;
  @include themed {
    box-shadow: 0 2px 4px 0 rgba(tget("color-text"), 0.1);
  }

  &.opened-yes {
    display: block;

    .panel-content {
      display: block;
    }
  }

  &.side-right {
    .panel-content {
      right: 0;
    }
  }
}

.panel-content {
  box-sizing: border-box;
  width: 360px;
  position: fixed;
  top: $header-height;
  bottom: 0;
  overflow: auto;
  @include themed {
    background-color: tget("surface-color");
    border: 1px solid rgba(tget("color-text"), 0.1);
  }
}
</style>

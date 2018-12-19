<template>
  <div class="hint pos-top" :class="{ [`align-${align}`]: true }" v-show="show">
    <div class="triangle"></div>
    <slot></slot>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

export default {
  name: "Hint",
  props: {
    align: { type: String, validator: validators.oneOf(["right", "left"]), default: "left" },
    showOn: { type: String, validator: validators.oneOf(["hover"]) }
  },
  data() {
    return {
      show: true,
      addedListeners: false
    };
  },
  mounted() {
    if (this.showOn === "hover") {
      this.addedListeners = true;
      this.show = false;
      this.$parent.$el.addEventListener("mouseenter", this.onMouseEnter);
      this.$parent.$el.addEventListener("mouseleave", this.onMouseLeave);
    }
  },
  destroyed() {
    if (this.addedListeners) {
      this.$parent.$el.removeEventListener("mouseenter", this.onMouseEnter);
      this.$parent.$el.removeEventListener("mouseleave", this.onMouseLeave);
    }
  },
  methods: {
    onMouseEnter() {
      this.show = true;
    },
    onMouseLeave() {
      this.show = false;
    }
  }
};
</script>

<style scoped>
.hint {
  position: absolute;
  max-width: 300px;
  background: rgba(25, 45, 70, 0.9);
  border-radius: 2px;
  padding: 6px 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
}

.pos-top {
  margin-bottom: 10px;
  margin-left: -7.5px;
  bottom: 100%;
}

.align-right {
  right: 0;
}

.triangle {
  position: absolute;
  bottom: -5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: rgba(25, 45, 70, 0.9) transparent transparent transparent;
}

.align-left .triangle {
  left: 10px;
}

.align-right .triangle {
  right: 10px;
}
</style>

<template>
  <div class="hint" :class="{ [`align-${align}`]: true, [`position-${position}`]: true }" v-show="show">
    <div class="triangle"></div>
    <slot></slot>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

export default {
  name: "Hint",
  props: {
    position: { type: String, validator: validators.oneOf(["top", "bottom"]), default: "top" },
    align: { type: String, validator: validators.oneOf(["right", "left", "center"]), default: "left" },
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
      this.$el.parentNode.addEventListener("mouseenter", this.onMouseEnter);
      this.$el.parentNode.addEventListener("mouseleave", this.onMouseLeave);
    }
  },
  destroyed() {
    if (this.addedListeners) {
      this.$el.parentNode.removeEventListener("mouseenter", this.onMouseEnter);
      this.$el.parentNode.removeEventListener("mouseleave", this.onMouseLeave);
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

<style scoped lang="scss">
.hint {
  position: absolute;
  max-width: 300px;
  background: rgba(25, 45, 70, 0.9);
  border-radius: 2px;
  padding: 6px 8px;
  color: #fff;
  font-size: 13px;
  z-index: 1000;
}

.position-top {
  margin-bottom: 10px;
  margin-left: -7.5px;
  bottom: 100%;

  .triangle {
    bottom: -5px;
    border-bottom-width: 0;
    border-top-color: rgba(25, 45, 70, 0.9);
  }
}

.position-bottom {
  margin-top: 10px;
  margin-left: -7.5px;
  top: 100%;

  .triangle {
    top: -5px;
    border-top-width: 0;
    border-bottom-color: rgba(25, 45, 70, 0.9);
  }
}

.align-left {
  .triangle {
    left: 10px;
  }
}

.align-right {
  right: 0;

  .triangle {
    right: 10px;
  }
}

.align-center {
  left: 50%;

  .triangle {
    left: 50%;
    margin-left: -5px;
  }
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px;
  border-color: transparent;
}
</style>

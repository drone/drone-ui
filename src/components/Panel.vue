<template>
  <div class="panel" :class="{ [`side-${side}`]: true, [`opened-${opened ? 'yes' : 'no'}`]: true }">
    <div class="panel-content" :style="{ bottom: `${bottom}px` }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

const FOOTER_HEIGHT = 56;

export default {
  name: "Panel",
  props: {
    name: { type: String, required: true },
    side: { type: String, required: true, validator: validators.oneOf(["right", "left"]) },
    opened: { type: Boolean, default: false }
  },
  data() {
    return {
      bottom: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onWindowScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  methods: {
    onWindowScroll() {
      const availableHeight = document.getElementsByTagName("html")[0].scrollHeight;
      const scrollYRemain = availableHeight - window.innerHeight - window.scrollY;
      const nextBottom = Math.max(FOOTER_HEIGHT - scrollYRemain, 0);

      if (nextBottom !== this.bottom) this.bottom = nextBottom;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.panel {
  width: 360px;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  overflow: hidden;
  flex-shrink: 0;
  display: none;

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
  background-color: #fff;
  overflow: auto;
}
</style>

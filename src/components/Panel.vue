<template>
  <div class="panel"
       :class="{ [`side-${side}`]: true, [`opened-${opened ? 'yes' : 'no'}`]: true }"
       :style="{ top: `${top}px` }">
    <slot></slot>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

const HEADER_HEIGHT = 60;

export default {
  name: "Panel",
  props: {
    side: { type: String, required: true, validator: validators.oneOf(["right", "left"]) },
    opened: { type: Boolean, default: false }
  },
  data() {
    return {
      top: 60
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
      const nextTop = Math.max(HEADER_HEIGHT - window.scrollY, 0);
      if (nextTop !== this.top) this.top = nextTop;
    }
  }
};
</script>

<style>
.panel {
  box-sizing: border-box;
  width: 360px;
  position: fixed;
  top: 60px;
  bottom: 0;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  background-color: #fff;
  transition: transform 0.25s linear;
}

.side-right {
  right: -360px;
}

.side-right.opened-yes {
  transform: translate3d(-360px, 0, 0);
}
</style>

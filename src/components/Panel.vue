<template>
  <div class="panel" :class="{ [`side-${side}`]: true, [`opened-${opened ? 'yes' : 'no'}`]: true }">
    <div class="panel-content" :style="{ top: `${top}px`, bottom: `${bottom}px` }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import * as validators from "@/lib/validators";

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 60;

export default {
  name: "Panel",
  props: {
    name: { type: String, required: true },
    side: { type: String, required: true, validator: validators.oneOf(["right", "left"]) },
    opened: { type: Boolean, default: false }
  },
  data() {
    return {
      top: 60,
      bottom: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onWindowScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  computed: {
    bodyClassName() {
      return `panel-opened-${this.name}`;
    }
  },
  methods: {
    onWindowScroll() {
      const availableHeight = document.getElementsByTagName("html")[0].scrollHeight;
      const scrollYRemain = availableHeight - window.innerHeight - window.scrollY;
      const nextTop = Math.max(HEADER_HEIGHT - window.scrollY, 0);
      const nextBottom = Math.max(FOOTER_HEIGHT - scrollYRemain, 0);

      if (nextTop !== this.top) this.top = nextTop;
      if (nextBottom !== this.bottom) this.bottom = nextBottom;
    },
    actualizeBodyClass(opened) {
      if (opened) {
        document.body.classList.add(this.bodyClassName);
      } else {
        document.body.classList.remove(this.bodyClassName);
      }
    }
  },
  watch: {
    opened(newValue) {
      this.actualizeBodyClass(newValue);
    }
  }
};
</script>

<style scoped lang="scss">
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
  top: 60px;
  bottom: 0;
  background-color: #fff;
  overflow: auto;
}
</style>

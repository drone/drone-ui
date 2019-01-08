<template>
  <div class="popup"
       :class="{ [`position-${position}`]: true, [`align-${align}`]: true, }"
       :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Popup",
  props: {
    position: { type: String, required: true, validator: x => ["bottom"].includes(x) },
    align: { type: String, required: true, validator: x => ["center", "right", "both", "left"].includes(x) },
    width: Number,
    maxWidth: Number
  },
  computed: {
    style() {
      const result = {};

      if (this.position === "bottom") {
        if (["right", "left", "center"].includes(this.align)) {
          result.width = `${this.width}px`;
          result.maxWidth = `${this.maxWidth}px`;

          if (this.align === "center") {
            result.marginLeft = `-${this.width / 2}px`;
          }
        }
      }

      return result;
    }
  }
};
</script>

<style scoped>
.popup {
  position: absolute;
  background: #fff;
  z-index: 5;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  border: solid 1px #edeef1;
}

.popup.position-bottom {
  top: 100%;
  margin-top: 10px;
}

.popup.position-bottom.align-center {
  left: 50%;
}

.popup.position-bottom.align-both,
.popup.position-bottom.align-right {
  right: 0;
}

.popup.position-bottom.align-both,
.popup.position-bottom.align-left {
  left: 0;
}
</style>

<style>
.repo-link.hover-type-box-shadow:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}

.repo-link .repo-item h3 {
  color: #0564d7;
}

.repo-link .repo-item-inactive h3 {
  color: #192d46;
}
</style>

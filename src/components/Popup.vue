<template>
  <Modal v-if="asModal" :className="`popup${evict ? ' evict' : ''}`">
    <slot/>
  </Modal>

  <div v-else :style="style"
       :class="{ [`position-${position}`]: true, [`align-${align}`]: true, popup: true, evict }">
    <slot/>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
export default {
  name: "Popup",
  components: { Modal },
  props: {
    position: { type: String, required: true, validator: x => ["bottom", "top"].includes(x) },
    align: { type: String, required: true, validator: x => ["center", "right", "both", "left"].includes(x) },
    evict: { type: Boolean, default: false },
    width: Number,
    maxWidth: Number
  },
  computed: {
    style() {
      const result = {};
      if (["right", "left", "center"].includes(this.align)) {
        result.width = `${this.width}px`;
        result.maxWidth = `${this.maxWidth}px`;
        if (this.align === "center") {
          result.marginLeft = `-${this.width / 2}px`;
        }
      }
      return result;
    },
    asModal() {
      return this.$store.state.mediaType === "mobile";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";
.popup {
  position: absolute;
  background: #fff;
  z-index: 5;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  border: solid 1px #edeef1;
  &.popup.evict {
    transform: translateX(-9999px);
  }
  &.position-top {
    bottom: 100%;
    margin-bottom: 10px;
  }
  &.position-bottom {
    top: 100%;
    margin-top: 10px;
  }
  &.position-top,
  &.position-bottom {
    &.align-center {
      left: 50%;
    }
    &.align-both,
    &.align-right {
      right: 0;
    }
    &.align-both,
    &.align-left {
      left: 0;
    }
  }
}
</style>

<style lang="scss">
.modal.popup.evict {
  display: none;
}
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

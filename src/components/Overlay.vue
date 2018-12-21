<template>
  <div class="overlay"></div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Overlay",
  props: {},
  data() {
    return {
      opened: false
    };
  },
  methods: {
    open() {
      if (!this.opened) {
        document.body.appendChild(this.$el);
        this.opened = true;
      }
    },
    close() {
      if (this.opened) {
        document.body.removeChild(this.$el);
        this.opened = false;
      }
    }
  },
  instance() {
    if (!this._instance) {
      const component = Vue.extend(this);
      this._instance = new component().$mount();
    }

    return this._instance;
  }
};
</script>

<style scoped>
.overlay {
  background: rgba(255, 255, 255, 0.75);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
}
</style>

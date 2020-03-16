<template>
  <portal to="body">
    <div :class="{ [className]: true, modal: true }">
      <Overlay opened/>

      <div class="modal-container">
        <div class="modal-content"><slot/></div>
      </div>
    </div>
  </portal>
</template>

<script>
import Overlay from "./Overlay";
export default {
  name: "Modal",
  components: { Overlay },
  props: {
    className: String
  }
};
</script>

<style lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.modal-container {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $overlay-z-index + 1;
  padding: $header-padding-side;
}
.modal-content {
  border-radius: 3px;
  min-width: 0;
  @include themed {
    border: solid 1px tget("border-color");
    background: tget("surface-color");
  }
  @include themed-only(default) {
    box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  }
  @include themed-only(dark) {
    box-shadow: 0 2px 4px 0 darken(tget("body-color"), 20%);
  }
}
</style>

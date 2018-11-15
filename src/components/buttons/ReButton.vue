<template>
  <Button class="re-button">
    <span><slot></slot></span>
    <IconRestart/>
  </Button>
</template>

<script>
import Button from "./Button";
import IconRestart from "../icons/IconRestart.vue";

export default {
  name: "ReButton",
  components: {
    Button,
    IconRestart
  }
};
</script>

<style scoped>
svg {
  padding-left: 10px;
  width: 18px;
  height: 18px;
  vertical-align: bottom;
}
</style>

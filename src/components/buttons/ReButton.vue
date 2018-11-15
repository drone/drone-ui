<template>
  <Button>
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

<template>
  <Button theme="default-light" :bordered="false">
    <IconPlay v-if="!pause"/>
    <IconPause v-if="pause"/>
  </Button>
</template>

<script>
import Button from "./Button";
import IconPlay from "../icons/IconPlay.vue";
import IconPause from "../icons/IconPause.vue";

export default {
  name: "ReButton",
  components: {
    Button,
    IconPlay,
    IconPause
  },
  props: {
    pause: { type: Boolean, default: false }
  }
};
</script>

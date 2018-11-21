<template>
  <Button theme="light" outline borderless>
    <IconPlay v-if="!pause"/>
    <IconPause v-if="pause"/>
  </Button>
</template>

<script>
import Button from "./Button";
import IconPlay from "../icons/IconPlay.vue";
import IconPause from "../icons/IconPause.vue";

export default {
  name: "PlayButton",
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

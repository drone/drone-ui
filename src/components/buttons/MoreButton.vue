<template>
<Button class="more-button" :bordered="false">
  <IconArrow direction="down"/>
  <span><slot></slot></span>
</Button>
</template>

<script>
import Button from "./Button";
import IconArrow from "../icons/IconArrow.vue";

export default {
  name: "MoreButton",
  components: {
    IconArrow,
    Button
  }
};
</script>

<style scoped>
button.more-button {
  font-size: 12px;
  color: #0564d7;
  display: flex;
  text-transform: none;
}

button.more-button:hover,
button.more-button:focus {
  color: #0564d7;
  outline: none;
}

button.more-button:hover span,
button.more-button:focus span {
  border-color: rgba(5, 100, 215, 0.5);
}

button.more-button:hover svg,
button.more-button:focus svg {
  color: rgba(5, 100, 215, 0.75);
}

span {
  border-bottom: 1px solid transparent;
}

svg {
  color: rgba(25, 45, 70, 0.25);
  padding-top: 10px;
}
</style>

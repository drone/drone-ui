<template>
<button @click="$emit('click')" class="more-button">
  <IconArrowDown />
  <span><slot></slot></span>
</button>
</template>

<script>
import IconArrowDown from "../icons/IconArrowDown.vue";

export default {
  name: "MoreButton",
  components: {
    IconArrowDown,
  },
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  outline: none;
  color: #0564d7;
  display: flex;
  align-items: center;
}

button:hover span {
  border-color: rgba(5, 100, 215, 0.5);
}

button:hover svg {
  fill: #0564d7;
  opacity: 0.75;
}

span {
  border-bottom: 1px solid transparent;
}

svg {
  width: 24px;
  height: 24px;
  fill: #192d46;
  margin-left: 5px;
  opacity: 0.25;
  padding-right: 10px;
}
</style>

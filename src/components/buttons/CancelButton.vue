<template>
<button @click="$emit('click')" class="cancel-button">
  <slot></slot>
  <IconCancel />
</button>
</template>

<script>
import IconCancel from "../icons/IconCancel.vue";

export default {
  name: "CancelButton",
  components: {
    IconCancel,
  },
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-transform: uppercase;
  outline: none;
  color: #192d46;
  opacity: 0.25;
  display: flex;
  align-items: center;
}

button:hover {
  opacity: 0.75;
}

svg {
  width: 16px;
  height: 16px;
  fill: #192d46;
  margin-right: 5px;
  padding-left: 10px;
}
</style>

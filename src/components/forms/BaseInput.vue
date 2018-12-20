<template>
  <input class="base-input" :value="value" @input="$emit('input', $event.target.value)"/>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    value: String
  }
};
</script>

<style scoped>
input {
  color: #192d46;
  border: 1px solid rgba(25, 45, 70, 0.25);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px 15px;
  height: 40px;
  line-height: 20px;
  background: #fff;
}

input[type="search"] {
  -webkit-appearance: none;
}

input:focus {
  border-color: #0564d7;
  outline: none;
}

input::placeholder {
  color: rgba(25, 45, 70, 0.6);
}
</style>

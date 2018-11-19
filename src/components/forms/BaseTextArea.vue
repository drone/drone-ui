<template>
  <textarea :value="value" @input="$emit('input', $event.target.value)"/>
</template>

<script>
export default {
  name: "BaseTextArea",
  props: {
    value: String
  }
};
</script>

<style scoped>
textarea {
  color: #192d46;
  border: 1px solid rgba(25, 45, 70, 0.25);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
}

textarea:focus {
  border-color: #0564D7;
  outline: none;
}

textarea::placeholder {
  color: rgba(25, 45, 70, 0.6);
}
</style>

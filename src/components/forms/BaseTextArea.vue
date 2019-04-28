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

<style scoped lang="scss">
@import "../../assets/styles/variables";

textarea {
  color: $color-text;
  border: 1px solid rgba($color-text, 0.25);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  -webkit-appearance: none;
}

textarea:focus {
  border-color: $color-primary;
  outline: none;
}

textarea::placeholder {
  color: $color-text-secondary;
}
</style>

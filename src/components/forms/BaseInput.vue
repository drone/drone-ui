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

<style scoped lang="scss">
@import "../../assets/styles/variables";

input {
  color: $color-text;
  border: 1px solid rgba($color-text, 0.25);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px 15px;
  height: 40px;
  line-height: 20px;
  background: #fff;
}

input[type="search"], input[type=text] {
  appearance: none;
}

input:focus {
  border-color: $color-primary;
  outline: none;
}

input::placeholder {
  color: $color-text-secondary;
}
</style>

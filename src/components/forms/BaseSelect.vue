<template>
  <select :value="value" @input="$emit('input', $event.target.value)">
    <option v-for="option in options" :key="option[0]" :value="option[0]">{{ option[1] }}</option>
  </select>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    value: null,
    options: Array
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variables";

select {
  color: $color-text;
  border: 1px solid rgba($color-text, 0.25);
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 30px 0 15px;
  height: 40px;
  line-height: 40px;
  -webkit-appearance: none;
  background: #fff
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><polygon fill='#98a1ab' points='0,30 100, 30 50,90'/></svg>")
    no-repeat center right 10px;
  background-size: 10px;
}

select:focus {
  border-color: $color-primary;
  outline: none;
}

select::placeholder {
  color: $color-text-secondary;
}
</style>

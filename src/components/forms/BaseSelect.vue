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
    url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48cG9seWdvbiBmaWxsPScjOThhMWFiJyBwb2ludHM9JzAsMzAgMTAwLCAzMCA1MCw5MCcvPjwvc3ZnPg==")
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

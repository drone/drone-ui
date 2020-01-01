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
@import "../../assets/styles/mixins";

input {
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px 15px;
  height: 40px;
  line-height: 20px;
  @include themed {
    background: tget("surface-color");
    color: tget("color-text");
    border: 1px solid rgba(tget("color-text"), 0.25);
  }
}

input[type="search"], input[type=text] {
  appearance: none;
}

input:focus {
  outline: none;
  @include themed {
    border-color: tget("color-primary");
  }
}

input::placeholder {
  @include themed {
    color: tget("color-text-secondary");
  }
}
</style>

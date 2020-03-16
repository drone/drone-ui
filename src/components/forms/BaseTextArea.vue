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
@import "../../assets/styles/mixins";

textarea {
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  -webkit-appearance: none;
  @include themed {
    background: tget("surface-color");
    color: tget("color-text");
    border: 1px solid rgba(tget("color-text"), 0.25);
  }
}

textarea:focus {
  outline: none;
  @include themed {
    border-color: tget("color-primary");
  }
}

textarea::placeholder {
  @include themed {
    color: tget("color-text-secondary");
  }
}
</style>

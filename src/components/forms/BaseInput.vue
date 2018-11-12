<template>
  <input ref="input"
         autocomplete="off"
         autocorrect="off"
         autocapitalize="off"
         spellcheck="false"
         :placeholder="placeholder"
         :value="value"
         @input="update"/>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    placeholder: String,
    value: String
  },
  methods: {
    update() {
      this.$emit("input", this.$refs.input.value);
    }
  }
};
</script>

<style scoped>
input {
  border: 1px solid #e8eaed;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
}

input::placeholder {
  color: rgba(25, 45, 70, 0.25);
}
</style>

<template>
  <Button @click.native="onclick" v-bind="buttonProps"><slot></slot></Button>
</template>

<script>
import Button from "@/components/buttons/Button";

export default {
  name: "ButtonConfirm",
  components: {
    Button
  },
  props: {
    ...Button.props,
    message: { type: String, default: "Are you sure?" }
  },
  computed: {
    buttonProps() {
      const result = {};
      Object.keys(Button.props).forEach(propName => {
        if (this[propName] !== undefined) {
          result[propName] = this[propName];
        }
      });
      return result;
    }
  },
  methods: {
    onclick(e) {
      if (confirm(this.message)) {
        const { click } = this.$listeners;
        click && click(e);
      }
    }
  }
};
</script>

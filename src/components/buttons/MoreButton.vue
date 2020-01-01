<template>
<Button class="more-button" theme="primary" outline borderless>
  <IconArrow direction="down"/>
  <span><slot></slot></span>
</Button>
</template>

<script>
import Button from "./Button";
import IconArrow from "../icons/IconArrow.vue";

export default {
  name: "MoreButton",
  components: {
    IconArrow,
    Button
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variables";
@import "../../assets/styles/mixins";

button.more-button {
  display: flex;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

button.more-button svg {
  opacity: 1;
}

button.button.theme-primary.outline.more-button:hover,
button.button.theme-primary.outline.more-button:focus {
  background: none;
}

button.more-button:hover span,
button.more-button:focus span {
  border-color: rgba(5, 100, 215, 0.5);
}

button.more-button:hover svg,
button.more-button:focus svg {
  @include themed {
    color: tget("color-primary");
  }
}

button svg + span {
  border-bottom: 1px solid transparent;
  margin-left: 6px;
}

span {
  height: 24px;
  line-height: 30px;
}

svg {
  @include themed {
    color: tget("color-text-secondary");
  }
  margin: 5px 0 0;
}
</style>

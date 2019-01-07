<template>
  <div class="dropdown">
    <Button @click.native="toggle" v-bind="buttonProps">
      <span>{{ title }}</span>
      <IconArrowDropdown :direction="opened ? 'up' : 'down'"/>
    </Button>

    <Popup v-show="opened" position="bottom" :align="align"><slot/></Popup>
  </div>
</template>

<script>
import Popup from "@/components/Popup";
import Button from "@/components/buttons/Button";
import IconArrowDropdown from "@/components/icons/IconArrowDropdown";

export default {
  name: "Dropdown",
  components: { IconArrowDropdown, Popup, Button },
  props: {
    title: { type: String, required: true },
    align: { type: String, default: "center" },
    buttonProps: Object
  },
  data() {
    return {
      opened: false
    };
  },
  methods: {
    toggle() {
      this.opened = !this.opened;
    }
  }
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.button > svg {
  margin-bottom: 1px;
}
</style>

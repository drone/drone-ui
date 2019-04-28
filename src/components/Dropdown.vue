<template>
  <div class="dropdown" v-click-outside="close">
    <Button @click.native="toggle" v-bind="buttonProps">
      <span>{{ title }}</span>
      <IconArrowDropdown :direction="opened ? 'up' : 'down'"/>
    </Button>

    <Popup v-if="opened" position="bottom" v-bind="popupProps"><slot/></Popup>
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
    buttonProps: Object,
    popupProps: Object
  },
  data() {
    return {
      opened: false
    };
  },
  methods: {
    toggle() {
      this.opened = !this.opened;
    },
    close() {
      if (this.opened) this.opened = false;
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

<template>
  <div class="base-switch">
    <input
      type="checkbox"
      :checked="value"
      :id="name"
      @change="$emit('input', $event.target.checked)"
    />
    <label :for="name">
      <slot></slot>
    </label>
  </div>
</template>

<script>
export default {
  name: "BaseSwitch",
  props: {
    name: { type: String, default: () => Math.random().toString() },
    value: { type: Boolean, required: true }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/variables";
@import "../../assets/styles/mixins";

.base-switch {
  $bg-disabled-color: rgba(0, 0, 0, 0.26);
  $lever-disabled-color: #fff;

  position: relative;

  input {
    top: 0;
    left: 0;
    width: 36px;
    height: 18px;
    opacity: 0;
    z-index: 0;
  }

  label {
    display: block;
    cursor: pointer;

    &:before {
      content: "";
      position: absolute;
      top: 5px;
      left: 0;
      width: 36px;
      height: 14px;
      background-color: $bg-disabled-color;
      border-radius: 14px;
      z-index: 1;
      transition: background-color 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:after {
      content: "";
      position: absolute;
      top: 2px;
      left: 0;
      width: 20px;
      height: 20px;
      background-color: $lever-disabled-color;
      border-radius: 14px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      z-index: 2;
      transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: left, background-color;
    }
  }

  input:checked + label {
    &:before {
      @include themed {
        background-color: rgba(tget("color-primary"), 0.5);
      }
    }

    &:after {
      left: 16px;
      @include themed {
        background-color: tget("color-primary");
      }
    }
  }
}
</style>

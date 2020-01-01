<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: "BaseForm"
};
</script>

<style lang="scss">
@import "../../assets/styles/mixins";

.control-group {
  display: flex;
  padding: 20px 0;
  align-items: center;

  @include tablet {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    flex-grow: 1;
    @include tablet {
      width: 100%;
    }

    .base-input {
      @include tablet {
        width: 100%;
      }
    }
  }
}

.control-group + .control-group {
  @include themed {
    border-top: 1px solid tget("border-color");
  }
}

.control-group .control-label {
  flex: 0 0 150px;
  margin-right: 15px;
  @include themed {
    color: tget("color-text-secondary");
  }

  @include tablet {
    flex-basis: auto;
    margin-bottom: 15px;
  }
}

.control-actions {
  display: flex;
  align-items: center;
}

.control-actions {
  padding-top: 15px;
  @include themed {
    border-top: 1px solid tget("border-color");
  }
}

.control-actions > .error-message {
  color: #ff4164;
  margin-left: 15px;
}
</style>

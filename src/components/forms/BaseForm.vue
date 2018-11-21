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

<style>
.control-group {
  display: flex;
  padding: 20px 0;
  align-items: center;
}

.control-group + .control-group {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

.control-group .control-label {
  flex-basis: 150px;
  margin-right: 15px;
  color: rgba(25, 45, 70, 0.6);
}

.control-actions {
  display: flex;
  align-items: center;
}

.control-group + .control-actions {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
  padding-top: 15px;
}

.control-actions > .error-message {
  color: #ff4164;
  margin-left: 15px;
}
</style>
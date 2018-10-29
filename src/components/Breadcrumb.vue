<template>
    <div class="breadcrumb">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: "Breadcrumb"
};
</script>

<style>
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  display: inline-block;
  margin-right: 15px;
  text-decoration: none;
}

.breadcrumb a:last-of-type {
  color: #2d4057;
}

.breadcrumb svg {
  width: 22px;
  height: 22px;
  margin-right: 15px;
  fill: #c4c9cf;
}
</style>

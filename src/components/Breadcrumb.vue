<template>
  <div class="breadcrumb">
    <LogoGit/>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import LogoGit from "./logos/LogoGit.vue";

export default {
  name: "Breadcrumb",
  components: {
    LogoGit
  }
};
</script>

<style>
.breadcrumb {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 80px;
  line-height: 18px;
}

.breadcrumb a {
  margin-right: 10px;
}

.breadcrumb span {
  color: rgba(25, 45, 70, 0.75);
}

.breadcrumb > svg {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  margin-right: 10px;
}
</style>

<style scoped>
.slot {
  height: 24px;
  display: flex;
  align-items: center;
}
</style>

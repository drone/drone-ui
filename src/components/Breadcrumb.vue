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
  font-size: 13px;
  line-height: 18px;
}

.breadcrumb a {
  display: inline-block;
  margin-right: 10px;
  text-decoration: none;
  font-size: 13px;
  color: rgba(5, 100, 215, 0.75);
  height: 18px;
}

.breadcrumb span {
  color: rgba(25, 45, 70, 0.75);
}

.breadcrumb a:focus,
.breadcrumb a:hover {
  position: relative;
  color: #0564d7;
  outline: none;
}

.breadcrumb a:focus:after,
.breadcrumb a:hover:after {
  content: "";
  position: absolute;
  bottom: -3px;
  height: 1px;
  background-color: rgba(5, 100, 215, 0.5);
  right: 0;
  left: 0;
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

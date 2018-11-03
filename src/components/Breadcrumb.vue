<template>
    <div class="breadcrumb">
      <LogoGithub class="github" />
      <slot></slot>
    </div>
</template>

<script>
import LogoGithub from "./logos/LogoGithub.vue";

export default {
  name: "Breadcrumb",
  components: {
    LogoGithub,
  },
};
</script>

<style>
.breadcrumb {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 80px;
}

.breadcrumb a {
  display: inline-block;
  margin-right: 10px;
  text-decoration: none;

  height: 18px;
  opacity: 0.75;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #0564d7;
}

.breadcrumb a:last-of-type {
  color: #192d46;
}

.breadcrumb svg {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  fill: #192d46;;
  opacity: 0.25;
}

.breadcrumb svg.github {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  margin-right: 10px;
  fill: #192d46;;
  opacity: 0.25;
}


</style>

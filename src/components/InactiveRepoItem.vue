<template>
    <div class="repo-item repo-item-inactive">
        <LogoGithub />
        <h3>{{ namespace }}/{{ name }}</h3>
        <span>View</span>
    </div>
</template>

<script>
import LogoGithub from "./logos/LogoGithub.vue";

export default {
  name: "InactiveRepoItem",
  components: {
    LogoGithub,
  },
  props: {
    namespace: String,
    name: String
  }
};
</script>

<style scoped>
div {
    align-items: center;
    border-radius: 2px;
    box-sizing: border-box;
    box-shadow: 0px 1px 4px 1px rgba(25, 45, 70, 0.02);
    border: solid 1px rgba(25, 45, 70, 0.08);
    background-color: #ffffff;
    display: flex;
    height: 50px;
    margin: 10px 0px;
    padding: 15px;
}

svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    fill: #192d46;
    opacity: 0.25;
}

h3 {
  flex: 1;
  opacity: 0.5;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

span {
  font-size: 12px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 1px;
  text-align: right;
  text-transform: uppercase;
  color: #0564d7;
}
</style>

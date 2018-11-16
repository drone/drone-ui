<template>
    <div class="repo-item repo-item-short" v-bind:class="{ 'repo-item-inactive': !active }">
        <LogoGit />
        <h3>{{ namespace }}/{{ name }}</h3>
        <Button v-if="!active" @click="activate" :bordered="false">Activate</Button>
    </div>
</template>

<script>
import LogoGit from "./logos/LogoGit.vue";
import Button from "./buttons/Button.vue";

export default {
  name: "ShortRepoItem",
  components: {
    LogoGit,
    Button
  },
  props: {
    namespace: String,
    name: String,
    active: Boolean,
    slug: String
  },
  methods: {
    activate() {
      const { namespace, name } = this;
      this.$store.dispatch("enableRepo", { namespace, name });
    }
  }
};
</script>

<style scoped>
div {
    align-items: center;
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
    border: solid 1px #EDEEF1;
    background-color: #ffffff;
    display: flex;
    height: 50px;
    padding: 15px;
    transition: box-shadow linear 0.2s;
}

svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.repo-item-inactive h3 {
  opacity: 0.6;
}

h3 {
  flex: 1;
  font-size: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

.button {
  letter-spacing: 1px;
  color: #0564d7;
  border-radius: 3px;
  transition: background-color linear 0.2s;
}

.button:hover {
  background-color: rgba(5, 100, 215, 0.05);
}
</style>

<template>
    <div class="repo-item repo-item-short" v-bind:class="{ 'repo-item-inactive': !active }">
        <LogoGit />
        <h3>{{ namespace }}/{{ name }}</h3>
        <span v-if="!active" @click="activate">Add</span>
    </div>
</template>

<script>
import LogoGit from "./logos/LogoGit.vue";

export default {
  name: "ShortRepoItem",
  components: {
    LogoGit
  },
  props: {
    namespace: String,
    name: String,
    active: Boolean,
    slug: String
  },
  methods: {
    activate(repo) {
      const { namespace, name } = repo;
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
}

svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.repo-item-inactive h3 {
  opacity: 0.5;
}

h3 {
  flex: 1;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

span {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0564d7;
  padding: 10px 15px;
  border-radius: 3px;
}

span:hover {
  background: rgba(5, 100, 215, 0.1);
}
</style>

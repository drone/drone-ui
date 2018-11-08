<template>
    <div class="repo-link">
        <router-link v-if="repo.active" :to="repo.slug">
            <slot></slot>
        </router-link>

        <div class="activate" v-if="!repo.active" v-on:click="handleActivate">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "RepoLink",
  props: {
    repo: Object
  },
  methods: {
    handleActivate: function() {
      const { namespace, name } = this.repo;
      this.$store.dispatch('enableRepo', { namespace, name });
      this.$router.push(namespace + "/" + name);
    }
  }
};
</script>

<style scoped>
.activate {
  cursor: pointer;
}
</style>

<style>
.repo-link:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}
</style>

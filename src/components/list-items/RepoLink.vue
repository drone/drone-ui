<template>
  <router-link class="repo-link" :to="to" :tabindex="focusable ? 0 : -1">
    <slot/>
  </router-link>
</template>

<script>
export default {
  name: "RepoLink",
  props: {
    repo: Object,
    focusable: { type: Boolean, default: true }
  },
  computed: {
    to() {
      const { repo } = this;
      const tab = repo.active ? "" : "settings";
      return `/${repo.namespace}/${repo.name}/${tab}`;
    }
  }
};
</script>

<style scoped>
.repo-link {
  display: block;
}
</style>

<style>
.repo-link:focus {
  outline: none;
}

.repo-link .repo-item.build-no.active-yes .header .title {
  color: #0564d7;
}

.repo-link .repo-item.build-no.active-no .header .title {
  color: #192d46;
}
</style>

<template>
  <router-link class="repo-link"
               :to="`/${repo.namespace}/${repo.name}`"
               :class="{ [`hover-type-${hoverType}`]: true, 'repo-active': repo.active }"
               :tabindex="focusable ? 0 : -1">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: "RepoLink",
  props: {
    repo: Object,
    hoverType: { type: String, default: "box-shadow" },
    focusable: { type: Boolean, default: true }
  }
};
</script>

<style scoped>
.repo-link {
  display: block;
}
</style>

<style>
.repo-link.hover-type-box-shadow:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}

.repo-link .repo-item h3 {
  color: #0564d7;
}

.repo-link .repo-item-inactive h3 {
  color: #192d46;
}
</style>

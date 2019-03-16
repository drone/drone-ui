<template>
  <router-link class="repo-link"
               :to="to"
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

<style lang="scss">
@import "../assets/styles/variables";

.repo-link.hover-type-box-shadow:focus {
  outline: none;
}

.repo-link.hover-type-box-shadow:focus .repo-item,
.repo-link.hover-type-box-shadow:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba($color-text, 0.2);
}

.repo-link .repo-item.active-yes .header .title {
  color: $color-primary;
}

.repo-link .repo-item.build-no.active-no .header .title {
  color: $color-text;
}
</style>

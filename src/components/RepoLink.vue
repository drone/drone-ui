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
@import "../assets/styles/mixins";

.repo-link.hover-type-box-shadow:focus {
  outline: none;
}

.repo-link.hover-type-box-shadow:focus .repo-item,
.repo-link.hover-type-box-shadow:hover .repo-item {
  @include themed-only(dark) {
    background: lighten(tget("surface-color"), 3%);
    box-shadow: 0 4px 10px 0 darken(tget("body-color"), 20%);
  }
  @include themed-only(default) {
    box-shadow: 0 4px 10px 0 rgba(tget("color-text"), 0.2);
  }
}

.repo-link .repo-item.active-yes .header .title {
  @include themed {
    color: tget("color-primary");
  }
}

.repo-link .repo-item.build-no.active-no .header .title {
  @include themed {
    color: tget("color-text");
  }
}
</style>

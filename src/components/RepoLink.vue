<template>
  <a class="repo-link"
     href="#"
     :class="[hoverClass, { 'repo-active': repo.active }]"
     @click.prevent="handle">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "RepoLink",
  props: {
    repo: Object,
    hoverType: { type: String, default: "box-shadow" }
  },
  computed: {
    hoverClass() {
      return "hover-type-" + this.hoverType;
    }
  },
  methods: {
    handle: function() {
      const { namespace, name, active } = this.repo;

      if (!active) {
        this.$store.dispatch("enableRepo", { namespace, name });
      }

      this.$router.push(`/${namespace}/${name}`);
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
.repo-link.hover-type-box-shadow:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}

.repo-link.hover-type-background:hover {
  background: rgba(25, 45, 70, 0.02);
}

.repo-link.hover-type-background:hover .repo-item {
  background: none;
}
</style>

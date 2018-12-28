<template><span></span></template>

<script>
const PROJECT_NAME = "Drone CI";
const HUMANIZED_ROUTE_NAMES = {
  settings: "Settings",
  "builds-feed": "Builds feed",
  search: "Search",
  account: "Account"
};

export default {
  name: "Title",
  computed: {
    repoName() {
      const { name, namespace } = this.$store.state.route.params;
      if (name && namespace) return `${namespace}/${name}`;
    },
    buildName() {
      const { build, step, stage } = this.$store.state.route.params;
      return build ? `Build #${build}${stage ? `.${stage}` : ""}${step ? `.${step}` : ""}` : null;
    },
    pageName() {
      return HUMANIZED_ROUTE_NAMES[this.$store.state.route.name];
    },
    value() {
      return [this.buildName, this.pageName, this.repoName, PROJECT_NAME].filter(x => x).join(" - ");
    }
  },
  watch: {
    value(nextValue) {
      document.title = nextValue;
    }
  },
  mounted() {
    document.title = this.value;
  }
};
</script>

<template>
  <div class="logs">
    <h1>Logs</h1>
    <div v-if="stage">
      <div>Name: {{ stage.name }}</div>
      <div>OS: {{ stage.os }}</div>
      <div>Arch: {{ stage.arch }}</div>
      <div>Version: {{ stage.version }}</div>
      <div>Variant: {{ stage.variant }}</div>
    </div>
    <div v-if="step">
      <div>Name: {{ step.name }}</div>
      <div>Status: {{ step.status }}</div>
      <div>Started: {{ step.started }}</div>
      <div>Finished: {{ step.finished }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "build",
  methods: {},
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    logs() {
        return [];
    },
    build() {
      var number = parseInt(this.$route.params.build);
      return this.$store.state.builds[this.namespace] &&
        this.$store.state.builds[this.namespace][number];
    },
    stage() {
        const {params} = this.$route;
        if (!this.build || !this.build.stages) return;
        return this.build.stages.find(function(stage) {
            return stage.number == parseInt(params.stage);
        });
    },
    step() {
        const {params} = this.$route;
        if (!this.stage || !this.stage.steps) return;
        return this.stage.steps.find(function(step) {
            return step.number == parseInt(params.step);
        });
    },
  }
};
</script>

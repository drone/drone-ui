<template>
  <div class="build">

    <div v-if="buildLoadingErr">
      Cannot retrieve the Build details.
    </div>

    <Build v-if="build"
      :number="build.number"
      :event="build.event"
      :status="build.status"
      :message="build.message"
      :commit="build.after"
      :branch="build.branch"
      :reference="build.ref"
      :created="build.created"
      :started="build.started"
      :finished="build.finished"
      :author="build.author_login"
      :avatar="build.author_avatar">
    </Build>

    <div v-if="build">
      <button v-on:click="handleCancel">Cancel</button>
      <button v-on:click="handleRestart">Restart</button>
      <a v-if="build.link" :href="build.link" target="_blank">View Commit</a>
    </div>

    <div v-if="build && build.stages">
      <Stage
        v-for="(stage) in build.stages"
        v-bind:key="stage.id"
        v-bind:name="stage.name"
        v-bind:status="stage.status"
        v-bind:created="stage.created"
        v-bind:started="stage.started"
        v-bind:finished="stage.finished">
          <router-link
            v-for="(step) in stage.steps"
            v-bind:key="step.id"
            v-bind:to="'/'+namespace+'/'+build.number+'/'+stage.number+'/'+step.number">
            <Step
              :name="step.name"
              :number="step.number"
              :status="step.status"
              :created="step.created"
              :started="step.started"
              :finished="step.finished">
            </Step>
          </router-link>
      </Stage>
    </div>
  </div>
</template>

<script>
import Build from "@/components/Build.vue";
import Step from "@/components/Step.vue";
import Stage from "@/components/Stage.vue";

export default {
  name: "build",
  methods: {},
  components: {
    Build,
    Step,
    Stage
  },
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    build() {
      var number = parseInt(this.$route.params.build);
      return this.$store.state.builds[this.namespace] &&
        this.$store.state.builds[this.namespace][number];
    },
    buildLoaded() {
      return this.$store.state.buildLoaded;
    },
    buildLoading() {
      return this.$store.state.buildLoading;
    },
    buildLoadingErr() {
      return this.$store.state.buildLoadingErr;
    },
  },
  methods: {
    handleCancel: function() {
      const {namespace, name, build} = this.$route.params;
      this.$store.dispatch('cancelBuild', {namespace, name, build})
    },
    handleRestart: function() {
      const {namespace, name, build} = this.$route.params;

      let router = this.$router;
      this.$store.dispatch('createBuild', {namespace, name, build}).then((data) => {
        router.push(`/${namespace}/${name}/${data.build.number}`);
      })
    }
  }
};
</script>

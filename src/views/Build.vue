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
      :title="build.title"
      :commit="build.after"
      :branch="build.target"
      :reference="build.ref"
      :created="build.created"
      :started="build.started"
      :finished="build.finished"
      :link="build.link"
      :author="build.author_login"
      :avatar="build.author_avatar">
      <footer>
        <CancelButton v-on:click="handleCancel" v-if="!build.finished">Cancel</CancelButton>
        <SyncButton v-on:click="handleRestart" v-if="build.finished">Restart</SyncButton>
      </footer>
    </Build>

    <main>
      <div class="container steps">
        <div v-if="build && build.stages">

          <span
            v-for="(_stage) in build.stages"
            v-bind:key="_stage.id"> <!-- begin: step loop -->

              <!--
                If the stage is not selected it is collapsed
                and rendered as a link. Clicking the link will
                change the route and expand the section.
              -->
              <router-link
                v-if="_stage !== stage"
                v-bind:to="'/'+namespace+'/'+build.number+'/'+_stage.number+'/1'">
                <Stage
                  v-bind:name="_stage.name"
                  v-bind:status="_stage.status"
                  v-bind:created="_stage.created"
                  v-bind:started="_stage.started"
                  v-bind:stopped="_stage.stopped">
                </Stage>
              </router-link>

              <!--
                If the stage is selected it is expanded, and
                all steps are displayed.
              -->
              <Stage
                v-if="_stage === stage"
                v-bind:key="_stage.id"
                v-bind:name="_stage.name"
                v-bind:status="_stage.status"
                v-bind:created="_stage.created"
                v-bind:started="_stage.started"
                v-bind:stopped="_stage.stopped">
                  <router-link
                    v-for="(_step) in _stage.steps"
                    v-bind:key="_step.id"
                    v-bind:to="'/'+namespace+'/'+build.number+'/'+_stage.number+'/'+_step.number">
                    <Step
                      :name="_step.name"
                      :number="_step.number"
                      :status="_step.status"
                      :created="_step.created"
                      :started="_step.started"
                      :stopped="_step.stopped"
                      :selected="_step === step">
                    </Step>
                  </router-link>
              </Stage>
            </span> <!-- end: step loop -->
        </div>
      </div>

      <div class="container output">
        <div v-for="(line) in logs" :key="line.pos">
          <div>{{line.pos+1}}</div>
          <div v-html="line._html"></div>
          <div>{{line.time}}s</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Build from "@/components/RepoItem.vue";
import Step from "@/components/Step.vue";
import Stage from "@/components/Stage.vue";

import CancelButton from "@/components/buttons/CancelButton.vue";
import SyncButton from "@/components/buttons/SyncButton.vue";

export default {
  name: "build",
  methods: {},
  components: {
    Build,
    Step,
    Stage,
    SyncButton,
    CancelButton,
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
    stage() {
      const number = parseInt(this.$route.params.stage || '1');
      return this.build &&
        this.build.stages &&
        this.build.stages.find((stage) => {
          return stage.number == number;
        });
    },
    step() {
      const number = parseInt(this.$route.params.step || '1');
      return this.stage &&
        this.stage.steps &&
        this.stage.steps.find((step) => {
          return step.number === number;
        });
    },
    logs() {
      return this.$store.state.logs;
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
  },
  watch: {
    /**
     * Watches for changes to pipeline steps. If the step
     * is complete it dispatches a request to fetch the
     * logs. If the step changes to running status it
     * dispatches a request to stream the logs. 
     */
    step: function (newStep, oldStep) {
      if (!newStep) return;

      // If a new step is loaded, dispatch a request to
      // fetch the completed step logs, or if the step
      // is running, dispatch a request to stream the logs.
      if (!oldStep || oldStep.id != newStep.id) {
        if (newStep.stopped) {
          this.$store.dispatch('fetchLogs', this.$route.params);
        } else if (newStep.started) {
          this.$store.dispatch('streamLogs', this.$route.params);
        }

      // If the step remains the same, but a propery changes,
      // dispatch a request to stream logs if the step changes
      // from pending to started status.
      } else if (newStep.started > 0 && !oldStep.started) {
          this.$store.dispatch('streamLogs', this.$route.params);
      }
    }
  },
};
</script>

<style scoped>
main {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

.container.steps {
  flex: 0 0 300px;
  position: sticky;
  top: 0px;
  margin-top: 0px;
  padding: 0px;
}

/* THIS IS A TOTAL HACK */
.container.steps > div > span > a > section,
.container.steps > div > span > section {
  margin-top: 0px;
}

.container.output {
  flex: 1;
  box-sizing: border-box;
  margin-top: 0px;
}

.repo-item {
  margin-top: 0px;
  margin-bottom: 20px;
}


.output {
  color: #FFF;
  font-size: 12px;
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;

  border: solid 1px rgba(25, 45, 70, 0.05);
  background-color: #192d46;
  border-radius: 6px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  box-sizing: border-box;
  margin: 15px 0px;
  margin-left: 15px;
  padding: 15px;

  box-sizing: border-box;
  min-width: 665px;
  max-width: 665px;
  width: 665px;
}

.output > div {
  display: flex;
  line-height: 19px;
  max-width: 100%;
}
.output > div > div:first-child {
    -webkit-user-select: none;
  color: #8c96a1;
    min-width: 20px;
    padding-right: 20px;
    user-select: none;
}
.output > div > div:last-child {
    -webkit-user-select: none;
  color: #8c96a1;
    padding-left: 20px;
    user-select: none;
}
.output > div > div:nth-child(2) {
    flex: 1 1 auto;
    min-width: 0px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
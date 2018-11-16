<template>
  <div class="build">

    <Button class="back-to-feed-button" :to="`/${namespace}`" :bordered="false">
      <IconArrow direction="left"/>
      <span>Back to activity feed</span>
    </Button>

    <div class="build-actions">
      <Button @click.native="handleCancel" v-if="!build.finished">
        <span>Cancel</span>
        <IconCancel/>
      </Button>
      <ReButton @click.native="handleRestart" v-if="build.finished">Restart</ReButton>
    </div>

    <div v-if="buildLoadingErr">
      Cannot retrieve the Build details.
    </div>

    <RepoItem metaAlign="left"
      v-if="build"
      :number="build.number"
      :status="build.status"
      :title="build.message"
      :message="build.author_login"
      :link="build.link"
      :avatar="build.author_avatar"
      :build="build"/>

    <main v-if="!isBuildError">
      <div class="stages">
        <div v-if="build && build.stages">

          <div class="stage-container"
               v-for="(_stage) in build.stages"
               :key="_stage.id">

              <!--
                If the stage is not selected it is collapsed
                and rendered as a link. Clicking the link will
                change the route and expand the section.
              -->
              <router-link
                v-if="_stage !== stage"
                v-bind:to="'/'+namespace+'/'+build.number+'/'+_stage.number+'/1'">
                <Stage
                  hoverable
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
                <div v-for="(_step) in _stage.steps" :key="_step.id" class="step-container">
                  <Step v-if="_step === step"
                        selected
                        :name="_step.name"
                        :number="_step.number"
                        :status="_step.status"
                        :created="_step.created"
                        :started="_step.started"
                        :stopped="_step.stopped"/>

                  <router-link v-else :to="'/'+namespace+'/'+build.number+'/'+_stage.number+'/'+_step.number">
                    <Step
                      :name="_step.name"
                      :number="_step.number"
                      :status="_step.status"
                      :created="_step.created"
                      :started="_step.started"
                      :stopped="_step.stopped">
                    </Step>
                  </router-link>
                  </div>
              </Stage>
            </div> <!-- end: step loop -->
        </div>
      </div>

      <ScrollLock v-if="outputFullscreen"/>
      <div class="output" :class="{'output-fullscreen': outputFullscreen}" v-if="!isStageError">
        <div class="output-header">
          <span class="output-title-pipeline">{{ stage && stage.name }}</span>
          <span class="output-title-step"> — {{ step && step.name }}</span>
          <div class="output-actions">
            <IconFullscreen :close="outputFullscreen" @click.native="toggleOutputFullscreen"/>
          </div>
        </div>
        <div class="output-content">
          <button v-if="showLimit" v-on:click="handleMore">showing the last {{limit}} lines</button>
          <div v-for="(line) in logs" :key="line.pos">
            <div>{{line.pos+1}}</div>
            <div v-html="line._html"></div>
            <div>{{line.time}}s</div>
          </div>
        </div>
      </div>

      <Alert v-if="isStageError" class="alert">
        {{stage.error}}
      </Alert>
    </main>

    <Alert v-if="isBuildError" class="alert">
      {{build.error}}
    </Alert>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoItem from "@/components/RepoItem.vue";
import Step from "@/components/Step.vue";
import Stage from "@/components/Stage.vue";

import IconCancel from "@/components/icons/IconCancel.vue";
import ReButton from "@/components/buttons/ReButton.vue";
import Button from "@/components/buttons/Button.vue";
import IconArrow from "@/components/icons/IconArrow.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import ScrollLock from "@/components/utils/ScrollLock.vue";

export default {
  name: "Build",
  components: {
    Alert,
    RepoItem,
    Step,
    Stage,
    ReButton,
    IconCancel,
    Button,
    IconArrow,
    ScrollLock,
    IconFullscreen
  },
  data() {
    return {
      outputFullscreen: false
    };
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
    limit() {
      return this.$store.state.logsLimit;
    },
    logs() {
      const logs = this.$store.state.logs || [];
      const show = Math.max(logs.length - this.limit, 0)
      return logs.slice(show);
    },
    showLimit() {
      return this.logs && this.limit == this.logs.length;
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
    isBuildError() {
     return this.build && this.build.error;
    },
    isStageError() {
      return this.stage && this.stage.error;
    }
  },
  methods: {
    handleMore: function() {
      this.$store.dispatch('expandLogs');
    },
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
    },
    toggleOutputFullscreen() {
      this.outputFullscreen = !this.outputFullscreen;
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
      } else if (newStep.finished > 0 && this.logs.length === 0) {
          this.$store.dispatch('fetchLogs', this.$route.params);
      }
    }
  },
};
</script>

<style scoped>
.back-to-feed-button {
  margin: 0 0 32px 15px;
}

.back-to-feed-button span {
  margin-left: 8px;
}

.build-actions {
  float: right;
}

main {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

.stages {
  flex: 0 0 300px;
  position: sticky;
  top: 0;
}

.stage-container + .stage-container {
  margin-top: 15px;
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

  background-color: #192d46;
  border-radius: 6px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  box-sizing: border-box;
  margin-left: 15px;
  padding: 0;

  width: 665px;
}

.output-fullscreen {
  position: fixed;
  top: 60px;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 0;
  width: auto;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.output-fullscreen .output-content {
  overflow: auto;
}

.output-header {
  padding: 17px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
}

.output-title-pipeline {
  font-weight: bold;
}

.output-title-step {
  opacity: 0.5;
}

.output-actions {
  float: right;
}

.output-actions .icon-fullscreen {
  cursor: pointer;
  opacity: 0.75;
}

.output-content {
  padding: 15px;
}

.output-content > div {
  display: flex;
  line-height: 19px;
  max-width: 100%;
}

.output-content > div > div:first-child {
    -webkit-user-select: none;
  color: #8c96a1;
    min-width: 20px;
    padding-right: 20px;
    user-select: none;
}
.output-content > div > div:last-child {
    -webkit-user-select: none;
  color: #8c96a1;
    padding-left: 20px;
    user-select: none;
}
.output-content > div > div:nth-child(2) {
    flex: 1 1 auto;
    min-width: 0px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.output > button {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 5px;
  color: #FFF;
  cursor: pointer;
  display: flex;
  height: 30px;
  margin-bottom: 20px;
  font-family: "Open Sans";
  align-items: center;
  justify-content: center;
  outline: none;
  text-align: center;
  text-transform: uppercase;
  opacity: 0.5;
  width: 100%;
}
.output > button:active {
  background: rgba(255,255,255,0.05);
}

.alert {
  display: flex;
  flex: 1;
  color: #ff3e61;
  border-color: #ff3e61;
  line-height: 18px;
  font-family: "Roboto Mono";
  font-size: 13px;
  text-align: left;
}

main > .alert {
  margin-left: 15px;
}
</style>

<style>
.stage-container > a:hover,
.stage-container > a:focus {
  outline: none;
}

.stage-container > a:hover header,
.stage-container > a:focus header {
  background: rgba(25, 45, 70, 0.02);
}

.stage-container > a:hover time,
.stage-container > a:focus time {
  display: none;
}

.stage-container > a:hover .arrow-dropdown,
.stage-container > a:focus .arrow-dropdown {
  display: inline-block;
}

.step-container > a:hover,
.step-container > a:focus {
  outline: none;
  background: rgba(25, 45, 70, 0.02);
}

.stage-container .stage div:first-of-type .step:before,
.stage-container .stage div:last-of-type .step:after {
  display: none;
}
</style>

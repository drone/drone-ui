<template>
  <div class="build">
    <div v-if="buildLoadingErr">
      Cannot retrieve the Build details.
    </div>

    <RepoItem metaAlign="left"
      v-if="build"
      :number="build.number"
      :status="build.status"
      :title="build.message"
      :avatar="build.author_avatar"
      :build="Object.assign({}, build, { message: null })"/>

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
          <div class="output-title" :title="stage && step && `${stage.name} - ${step.name}`">
            <span class="output-title-pipeline">{{ stage && stage.name }}</span>
            <span> — {{ step && step.name }}</span>
          </div>
          <div class="output-actions">
            <PlayButton v-if="step && !step.stopped" title="Follow logs" @click.native="toggleFollow" :pause="follow"/>
            <div v-if="step && !step.stopped" class="divider"></div>
            <Button v-if="readyToDownload" title="Download" @click.native="download" theme="light" outline borderless
                    class="download">
              <IconDownload :close="outputFullscreen" />
            </Button>
            <div v-if="readyToDownload" class="divider"></div>
            <Button title="Fullscreen" @click.native="toggleOutputFullscreen" theme="light" outline borderless>
              <IconFullscreen :close="outputFullscreen" />
            </Button>
          </div>
        </div>
        <div class="output-content" ref="outputContent">
          <div v-if="logsLoading" class="output-loading">Loading...</div>

          <div class="output-content-actions output-content-actions-top" v-if="!logFromTop && moreCount">
            <!--todo replace with Button if the design is not changed-->
            <button class="output-button" @click="handleMore">
              Show {{Math.min(moreCount, logStep)}} lines more
            </button>
            <button class="output-button" @click="toggleLogFrom">To top</button>
          </div>

          <div v-for="line in shownLogs" :key="line.pos" class="output-line">
            <div>{{line.pos+1}}</div>
            <div v-html="line._html"></div>
            <div>{{line.time}}s</div>
          </div>

          <div class="output-content-actions output-content-actions-bottom" v-if="logFromTop && moreCount">
            <!--todo replace with Button if the design is not changed-->
            <button class="output-button" @click="handleMore">
              Show {{Math.min(moreCount, logStep)}} lines more
            </button>
            <button class="output-button" @click="toggleLogFrom">To bottom</button>
          </div>

        </div>
        <div ref="bottomAnchor"></div>
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
import Button from "@/components/buttons/Button.vue";
import PlayButton from "@/components/buttons/PlayButton.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import ScrollLock from "@/components/utils/ScrollLock.vue";

export default {
  name: "Build",
  components: {
    Alert,
    RepoItem,
    Step,
    Stage,
    IconCancel,
    Button,
    PlayButton,
    ScrollLock,
    IconDownload,
    IconFullscreen
  },
  data() {
    return {
      outputFullscreen: false,
      follow: false,
      logStep: 250,
      logLimit: 250,
      logFromTop: false
    };
  },
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.namespace];
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
    shownLogs() {
      if (this.logFromTop) {
        return this.logs.slice(0, this.logLimit);
      } else {
        return this.logs.slice(this.logs.length - this.logLimit);
      }
    },
    logs() {
      return this.$store.state.logs;
    },
    logsLoading() {
      return this.$store.state.logsLoading;
    },
    moreCount() {
      return Math.max(this.logs.length - this.logLimit, 0);
    },
    buildLoadingErr() {
      return this.$store.state.buildLoadingErr;
    },
    isBuildError() {
     return this.build && this.build.error;
    },
    isStageError() {
      return this.stage && this.stage.error;
    },
    isCollaborator() {
      return this.repo && this.repo.permissions && this.repo.permissions.write || false;
    },
    readyToDownload() {
      return this.step && this.step.stopped && this.$store.state.logs && this.$store.state.logs.length;
    }
  },
  methods: {
    handleMore: function() {
      this.logLimit += this.logStep;
    },
    toggleOutputFullscreen() {
      this.outputFullscreen = !this.outputFullscreen;
    },
    toggleFollow() {
      this.follow = !this.follow;
      if (this.follow) this.scrollToBottom();
    },
    toggleLogFrom() {
      this.logFromTop = !this.logFromTop;
    },
    scrollToBottom() {
      if (this.outputFullscreen) {
        const { outputContent } = this.$refs;
        outputContent.scrollTop = outputContent.scrollHeight + 15; // 15 - padding
      } else {
        this.$refs.bottomAnchor.scrollIntoView();
      }
    },
    download() {
      const {namespace, name, stage, step} = this.$route.params;
      const link = document.createElement("a");
      const logsClone = this.$store.state.logs.slice(0);

      for (let i = 0; i < logsClone.length; ++i) {
        delete logsClone[i]._html;
      }

      const blob = new Blob([JSON.stringify(logsClone)], { type: "application/json" });

      link.download = `logs_${namespace}_${name}_${stage}_${step}.json`;
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.click();
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
        this.follow = false;
        this.logLimit = 250;

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
    },
    logs(newValue, oldValue) {
      if (this.follow && newValue && oldValue.length < newValue.length) {
        setTimeout(() => this.scrollToBottom(), 0);
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

.stages {
  flex: 0 0 300px;
  position: sticky;
  top: 0;
}

.stage-container + .stage-container {
  margin-top: 15px;
}

.repo-item {
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
  margin-left: 20px;
  padding: 0;
  width: 660px;
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
  position: sticky;
  top: 0;
  background: #192d46;
  padding: 8px 15px 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-radius: 6px 6px 0 0;
}

.output-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px 0;
}

.output-title-pipeline {
  font-weight: bold;
  color: #fff;
}

.output-actions {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.output-actions .divider {
  display: inline-block;
  height: 24px;
  width: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 5px;
}

.output-content {
  padding: 15px;
}

.output-loading {
  text-align: center;
}

.output-line {
  display: flex;
  line-height: 19px;
  max-width: 100%;
}

.output-line > div:first-child {
  -webkit-user-select: none;
  color: #8c96a1;
  min-width: 20px;
  padding-right: 20px;
  user-select: none;
}
.output-line > div:last-child {
  -webkit-user-select: none;
  color: #8c96a1;
  padding-left: 20px;
  user-select: none;
}
.output-line > div:nth-child(2) {
  flex: 1 1 auto;
  min-width: 0px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-content-actions {
  display: flex;
}

.output-content-actions-top {
  margin-bottom: 15px;
}

.output-content-actions-bottom {
  margin-top: 15px;
}

.output-button {
  flex: 1 0 0;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  border: none;
  color: #8c96a1;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 0px;
  cursor: pointer;
  transition: all 0.4s ease-in-out;
}

.output-button + .output-button {
  margin-left: 15px;
}

.output-button:hover {
  background: rgba(255,255,255,0.1);
  color: #FFF;
}

.button.theme-light.outline.download > svg {
  width: 21px;
  height: 22px;
  margin-bottom: -6px;
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
  background-color: rgba(25, 45, 70, 0.02);
}

.stage-container .stage div:first-of-type .step:after {
  top: 50%;
}

.stage-container .stage div:last-of-type .step:after {
  bottom: 50%;
}
</style>

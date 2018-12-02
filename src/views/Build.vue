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
      <div v-if="build && build.stages" class="stages" ref="stages">
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

      <ScrollLock v-if="outputFullscreen"/>
      <div class="output" :class="{'output-fullscreen': outputFullscreen}" v-if="!isStageError" ref="output">
        <div ref="topAnchor"></div>

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
          <div v-if="logsLoading" class="output-loading">Loading</div>

          <div class="output-content-actions" v-if="moreCount">
            <Button size="l" outline borderless class="output-button" @click.native="handleMore">
              Show {{Math.min(moreCount, logStep)}} lines more
            </Button>
          </div>

          <div v-for="line in shownLogs" :key="line.pos" class="output-line">
            <div>{{line.pos+1}}</div>
            <div v-html="line._html"></div>
            <div>{{line.time}}s</div>
          </div>
        </div>

        <div ref="bottomAnchor"></div>

        <div class="to-top" @click="scrollToTop" v-show="!logsLoading && showToTop">
          <IconArrow direction="up"/>
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
import Button from "@/components/buttons/Button.vue";
import PlayButton from "@/components/buttons/PlayButton.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import ScrollLock from "@/components/utils/ScrollLock.vue";
import IconArrow from "../components/icons/IconArrow";

let previousScrollY = window.scrollY;

export default {
  name: "Build",
  components: {
    IconArrow,
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
      showToTop: false
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
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
      return this.logs.slice(this.logs.length - this.logLimit);
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
    scrollToBottom() {
      if (this.outputFullscreen) {
        const { outputContent } = this.$refs;
        outputContent.scrollTop = outputContent.scrollHeight + 15; // 15 - padding
      } else {
        this.$refs.bottomAnchor.scrollIntoView();
      }
    },
    scrollToTop() {
      if (this.outputFullscreen) {
        this.$refs.outputContent.scrollTop = 0;
      } else {
        this.$refs.topAnchor.scrollIntoView();
      }
    },
    download() {
      let output = "";
      for (let i = 0; i < this.logs.length; ++i) {
        output += this.logs[i].out;
      }

      const { namespace, name, stage, step } = this.$route.params;
      const link = document.createElement("a");
      const blob = new Blob([output], { type: "application/text" });

      link.download = `logs_${namespace}_${name}_${stage}_${step}.log`;
      link.href = URL.createObjectURL(blob);
      link.target = "_blank";
      link.click();
    },
    onScroll() {
      const delta = window.scrollY - previousScrollY;
      previousScrollY = window.scrollY;

      const stages = this.$refs.stages;
      const stagesRect = stages.getBoundingClientRect();

      if (stagesRect.y <= 0 && window.innerHeight < stagesRect.height) {
        const top = parseInt(stages.style.top || 0);
        const newTop = Math.max(Math.min(0, top - delta), window.innerHeight - stagesRect.height);

        stages.style.top = `${newTop}px`;
      }

      this.showToTop = this.$refs.output.getBoundingClientRect().y < 0;
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
  }
};
</script>

<style scoped>
.repo-item {
  margin-bottom: 20px;
}

main {
  display: flex;
  align-items: flex-start;
}

.stages {
  flex: 0 0 300px;
  position: sticky;
  top: 0;
}

.stage-container + .stage-container {
  margin-top: 15px;
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

.output-fullscreen .to-top {
  position: absolute;
  top: unset;
  bottom: 0;
  right: 0;
  display: block !important;
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

.output-loading:after {
  position: absolute;
  overflow: hidden;
  display: inline-block;
  animation: ellipsis steps(4, end) 1s infinite;
  content: "...";
  width: 0;
}

@keyframes ellipsis {
  to {
    width: 28px;
  }
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
  margin-bottom: 15px;
}

.output-button.button.outline.theme-default {
  width: 100%;
  background-color: rgba(216, 216, 216, 0.07);
  font-family: "Roboto Mono", monospace;
  text-transform: none;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: normal;
}

.output-button.button.outline.theme-default:hover,
.output-button.button.outline.theme-default:focus {
  color: #fff;
}

.button.theme-light.outline.download > svg {
  width: 21px;
  height: 22px;
  margin-bottom: -6px;
}

.to-top {
  float: right;
  position: sticky;
  bottom: 0;
  cursor: pointer;
  width: 21px;
  height: 30px;
  background: #192d46;
  color: rgba(255, 255, 255, 0.75)
}

.to-top > svg {
  margin-top: 5px;
}

.to-top:hover {
  color: #fff;
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

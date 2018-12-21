<template>
  <div class="build">
    <Loading v-if="buildLoading"/>

    <portal v-if="build && !buildLoading" to="secondary-page-header-actions">
      <div class="header-actions">
        <Button outline class="button-source" :href="build.link" target="_blank">
          <span>View source</span>
          <IconSource/>
        </Button>

        <Button outline v-if="build.finished"
                @click.native="handleRestart"
                :disabled="!isCollaborator">
          <span>Restart</span>
          <IconRestart/>
        </Button>

        <ButtonConfirm v-else outline
                       @click="handleCancel"
                       :disabled="!isCollaborator"
                       class="button-cancel">
          <span>Cancel</span>
          <IconCancel/>
        </ButtonConfirm>
      </div>
    </portal>

    <RepoItem
      v-if="build && !buildLoading"
      :number="build.number"
      :status="build.status"
      :title="build.message"
      :avatar="build.author_avatar"
      :linkRepo="repo"
      :build="Object.assign({}, build, { message: null })"/>

    <Loading v-if="!buildLoading && stagesLoading" text="Loading stages and steps"/>

    <AlertError :error="buildLoadingErr"/>

    <main v-if="build && !buildLoadingErr && !isBuildError && stagesLoaded">
      <div class="stages" ref="stages">
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
            v-bind:to="'/'+slug+'/'+build.number+'/'+_stage.number+'/1'">
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

              <router-link v-else :to="'/'+slug+'/'+build.number+'/'+_stage.number+'/'+_step.number">
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
      <div class="output"
           :class="{'output-fullscreen': outputFullscreen, 'show-to-top': !logsLoading && showToTop}"
           v-if="!isStageError"
           ref="output">
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
          <Loading v-if="logsLoading"/>

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

        <div class="to-top" @click="scrollToTop"><IconArrow direction="up"/></div>
      </div>
    </main>

    <Alert v-if="isBuildError" class="alert">
      {{build.error}}
    </Alert>

    <Alert v-if="isStageError" class="alert">
      {{stage.error}}
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
import ButtonConfirm from "@/components/buttons/ButtonConfirm.vue";
import PlayButton from "@/components/buttons/PlayButton.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import IconRestart from "@/components/icons/IconRestart.vue";
import ScrollLock from "@/components/utils/ScrollLock.vue";
import Loading from "@/components/Loading.vue";
import IconArrow from "../components/icons/IconArrow";
import IconSource from "../components/icons/IconSource";
import AlertError from "../components/AlertError";

let previousScrollY = window.scrollY;

export default {
  name: "Build",
  components: {
    AlertError,
    IconArrow,
    Alert,
    RepoItem,
    Step,
    Stage,
    IconCancel,
    Button,
    ButtonConfirm,
    PlayButton,
    ScrollLock,
    Loading,
    IconDownload,
    IconRestart,
    IconSource,
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
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    build() {
      const number = parseInt(this.$route.params.build);
      const collection = this.$store.state.builds[this.slug];
      return collection && collection.data[number];
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
      const from = Math.max(this.logs.length - this.logLimit, 0);
      return this.logs.slice(from);
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
    buildLoading() {
      const { buildLoaded, buildLoading } = this.$store.state;
      return !buildLoaded && buildLoading;
    },
    buildLoadingErr() {
      return this.$store.state.buildLoadingErr;
    },
    stagesLoading() {
      return this.$store.state.buildLoading && !this.stagesLoaded;
    },
    stagesLoaded() {
      return this.build && this.build.stages;
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
    handleCancel: function() {
      const { namespace, name, build } = this.$route.params;
      this.$store.dispatch("cancelBuild", { namespace, name, build });
    },
    handleRestart: function() {
      const { namespace, name, build } = this.$route.params;

      this.$store.dispatch("createBuild", { namespace, name, build }).then(data => {
        this.$router.push(`/${namespace}/${name}/${data.build.number}`);
      });
    },
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

      if (!stages) return;

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

<style scoped lang="scss">
@import "../assets/styles/mixins";

.header-actions {
  margin: -5px;
  align-self: flex-start;

  @include mobile {
    margin-top: 10px;
  }

  .button {
    margin: 5px;
  }
}

.button-cancel svg {
  width: 15px;
  height: 15px;
  margin-bottom: -2px;
}

.button-source > svg {
  width: 24px;
  height: 24px;
  margin-bottom: -7px;
}

.repo-item {
  margin-bottom: 20px;
}

main {
  display: flex;
  align-items: flex-start;

  @include tablet {
    flex-direction: column;
  }
}

.stages {
  flex: 0 0 300px;
  width: 300px;
  position: sticky;
  top: 0;

  @include tablet {
    flex: 1 0 auto;
    width: 100%;
    margin-bottom: 20px;
    position: static;
  }
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
  flex-grow: 1;

  @include tablet {
    margin: 0;
    width: 100%;
  }
}

.output.show-to-top .to-top {
  display: block;
}

.output.show-to-top .output-content {
  margin-bottom: -30px;
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
  z-index: 10;
}

.output-fullscreen .output-content {
  overflow: auto;
}

.output-fullscreen .to-top {
  position: absolute;
  top: unset;
  bottom: 0;
  right: 0;
  display: block;
}

.output-header {
  position: sticky;
  top: 0;
  background: #192d46;
  padding: 8px 5px 7px 15px;
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

.loading:after {
  animation-name: ellipsis;
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
  flex-shrink: 0;
}
.output-line > div:last-child {
  -webkit-user-select: none;
  color: #8c96a1;
  padding-left: 20px;
  user-select: none;
  flex-shrink: 0;
}
.output-line > div:nth-child(2) {
  flex-grow: 1;
  word-break: break-all;
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
  color: rgba(255, 255, 255, 0.75);
  display: none;
  border-bottom-right-radius: 6px;
}

.to-top > svg {
  margin-top: 5px;
}

.to-top:hover {
  color: #fff;
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

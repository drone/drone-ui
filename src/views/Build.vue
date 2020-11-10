<template>
  <div class="build">
    <Loading v-if="buildShowState === 'loading'"/>

    <portal v-if="buildShowState === 'data'" to="secondary-page-header-actions">
      <div class="header-actions">
        <Button outline class="button-source" :href="link" target="_blank">
          <span>View source</span>
          <IconSource/>
        </Button>

        <Button outline v-if="isBuildFinished(build)"
                class="button-restart"
                @click.native="handleRestart"
                :disabled="!isCollaborator">
          <span>Restart</span>
          <IconRestart/>
        </Button>

        <Button outline v-if="isBuildFinished(build)"
                class="button-debug"
                @click.native="handleDebug"
                :disabled="!isCollaborator">
          <IconBug/>
        </Button>

        <Button outline v-if="showDeployButton"
                class="button-promote"
                @click.native="openDeployModal">
          <IconDeploy/>
        </Button>

        <ButtonConfirm v-if="showCancelButton" outline
                       @click="handleCancel"
                       :message="`Are you sure to cancel build #${build.number}?`"
                       class="button-cancel">
          <span>Cancel</span>
          <IconCancel/>
        </ButtonConfirm>
      </div>
    </portal>

    <Modal className="deployment-modal" v-if="showDeploymentModal">
      <DeploymentForm @submit="handleDeploy" @cancel="closeDeployModal" :number="build.number" />
    </Modal>

    <RepoItem
      v-if="buildShowState === 'data'"
      :number="build.number"
      :status="build.status"
      :title="build.title || build.message"
      :avatar="build.author_avatar"
      :linkRepo="repo"
      :build="Object.assign({}, build, { message: null })"/>

    <AlertError v-if="buildShowState === 'loadingError'" :error="this.buildCollection.error"/>
    <Alert v-if="buildShowState === 'buildError'" theme="danger">{{ build.error }}</Alert>

    <Loading v-if="buildShowState === 'data' && stagesShowState === 'loading'" text="Loading stages and steps"/>

    <div class="build-content" v-if="buildShowState === 'data' && stagesShowState === 'data'">
      <div class="stages" ref="stages">
        <div class="stage-container" v-for="(_stage) in build.stages" :key="_stage.id">

          <!--
            If the stage is not selected it is collapsed
            and rendered as a link. Clicking the link will
            change the route and expand the section.
          -->
          <router-link v-if="_stage !== stage" :to="'/'+slug+'/'+build.number+'/'+_stage.number+'/1'">
            <Stage :stage="_stage"/>
          </router-link>

          <!--
            If the stage is selected it is expanded, and
            all steps are displayed.
          -->
          <Stage v-else :stage="_stage">
            <div v-for="(_step) in _stage.steps" :key="_step.id" class="step-container">
              <Step v-if="_step === step"
                    selected
                    :name="_step.name"
                    :status="_step.status"
                    :created="_step.created"
                    :started="_step.started"
                    :stopped="_step.stopped"/>

              <router-link v-else :to="'/'+slug+'/'+build.number+'/'+_stage.number+'/'+_step.number">
                <Step
                  :name="_step.name"
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

      <div class="stage-content" v-if="stage">
        <Alert v-if="stageError" class="stage-error" theme="danger">{{ stage.name }}: {{ stage.error }}</Alert>

        <div v-if="['loading', 'data'].includes(logsShowState)"
             class="output"
             :class="{'output-fullscreen': outputFullscreen, 'show-to-top': logsShowState === 'data' && showToTop}"
             ref="output">
          <div ref="topAnchor"></div>

          <div class="output-header" ref="outputHeader">
            <div class="output-header-visibility-fix" ref="visibilityFix"/>
            <div class="output-header-content">
              <div class="output-title" :title="stage && step && `${stage.name} - ${step.name}`">
                <span class="output-title-stage">{{ stage && stage.name }}</span>
                <span class="output-title-step"> — {{ step && step.name }}</span>
              </div>
              <time-elapsed v-if="step && step.started"
                            :started="step.started"
                            :stopped="step.stopped"
                            class="output-time-elapsed"/>
              <div class="output-actions">
                <PlayButton v-if="step && !step.stopped"
                            title="Follow logs"
                            @click.native="toggleFollow"
                            :pause="follow"/>
                <div v-if="step && !step.stopped" class="divider"></div>
                <Button outline borderless v-if="readyToDownload"
                        title="Download"
                        @click.native="download"
                        theme="light"
                        class="download">
                  <IconDownload :close="outputFullscreen"/>
                </Button>
                <div v-if="readyToDownload" class="divider"></div>
                <Button title="Fullscreen" @click.native="toggleOutputFullscreen" theme="light" outline borderless>
                  <IconFullscreen :close="outputFullscreen"/>
                </Button>
              </div>
            </div>
          </div>
          <div class="output-content" ref="outputContent" @scroll="onOutputContentScroll">
            <Loading v-if="logsShowState === 'loading'"/>

            <div class="output-content-actions" v-if="moreCount">
              <Button size="l" outline borderless class="output-button" @click.native="handleMore">
                Show {{Math.min(moreCount, logStep)}} lines more
              </Button>
              <Button size="l" outline borderless class="output-button" @click.native="handleAll">
                Show all lines
              </Button>
            </div>

            <table class="output-lines">
              <tbody>
              <tr v-for="line in shownLogs" :key="line.pos">
                <td class="ol-pos">{{line.pos+1}}</td>
                <td class="ol-html" v-html="line._html"></td>
                <td class="ol-time">{{line.time}}s</td>
              </tr>
              </tbody>
            </table>
          </div>


          <div ref="bottomAnchor"></div>

          <div class="to-top" @click="scrollToTop">
            <IconArrow direction="up"/>
          </div>
        </div>

        <AlertError v-else-if="logsShowState === 'loadingError'" :error="logsCollection.error"/>

        <Alert v-else-if="!step || logsShowState === 'empty'"
               :theme="getThemeByStatus(step ? step.status : stage.status)">
          {{ stage.name }}{{ step ? ` – ${step.name}` : '' }}: {{ humanizeStatus(step ? step.status : stage.status) }}
        </Alert>

        <template v-if="stage && stage.status === 'blocked'">
          <Button theme="danger" @click.native="declineBuild">Decline</Button>
          <Button theme="primary" @click.native="approveBuild">Approve</Button>
        </template>
      </div>
    </div>
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
import DeploymentForm from "@/components/forms/DeploymentForm.vue";
import PlayButton from "@/components/buttons/PlayButton.vue";
import IconDeploy from "@/components/icons/IconDeploy.vue";
import IconBug from "@/components/icons/IconBug.vue";
import IconFullscreen from "@/components/icons/IconFullscreen.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import IconRestart from "@/components/icons/IconRestart.vue";
import Modal from "@/components/Modal.vue";
import ScrollLock from "@/components/utils/ScrollLock.vue";
import Loading from "@/components/Loading.vue";
import IconArrow from "../components/icons/IconArrow";
import IconSource from "../components/icons/IconSource";
import AlertError from "../components/AlertError";
import TimeElapsed from "../components/TimeElapsed";
import Status from "@/components/Status";

import { isBuildFinished } from "@/lib/buildHelper";

let previousScrollY = window.scrollY;
const HEADER_HEIGHT = 56;
const STAGES_TOP = HEADER_HEIGHT;
const STAGES_PADDING = 20;
const STAGES_TOP_BREAKPOINT = STAGES_TOP + STAGES_PADDING;
const OUTPUT_HEADER_STICKY_OFFSET = 20;

export default {
  name: "Build",
  components: {
    TimeElapsed,
    AlertError,
    DeploymentForm,
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
    Modal,
    IconArrow,
    IconBug,
    IconDownload,
    IconDeploy,
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
      showToTop: false,
      showDeploymentModal: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
    // Load logs for the step on initial mounting
    // Check why we don't do this on data loading
    this.loadLogsForStep(this.step);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    user() {
      return this.$store.state.user && this.$store.state.user.data;
    },
    buildCollection() {
      const number = this.$route.params.build;
      const collection = this.$store.state.builds[this.slug];
      return collection && collection.data[number];
    },
    build() {
      return this.buildCollection.data;
    },
    link() {
      return this.build && this.repo &&
        `/link/${this.repo.slug}/tree/${this.build.ref}?sha=${this.build.after}`
    },
    buildShowState() {
      if (this.buildCollection.lStatus === "error") return "loadingError";
      if (this.build && this.build.error) return "buildError";
      if (this.buildCollection.dStatus === "present") return "data";
      if (this.buildCollection.lStatus === "loading") return "loading";
    },
    stage() {
      if (!this.build) return;

      const number = parseInt(this.$route.params.stage) || "1";
      return this.build.stages && this.build.stages.find(stage => stage.number === number);
    },
    stagesShowState() {
      if (this.build && this.build.stages) return "data";
      if (this.buildCollection.lStatus === "loading") return "loading";
    },
    step() {
      if (!this.stage) return;

      const number = parseInt(this.$route.params.step || "1");
      return (
        this.stage &&
        this.stage.steps &&
        this.stage.steps.find(step => {
          return step.number === number;
        })
      );
    },
    shownLogs() {
      const from = Math.max(this.logs.length - this.logLimit, 0);
      return this.logs.slice(from);
    },
    logsCollection() {
      return this.$store.state.logs;
    },
    logs() {
      return this.logsCollection.data;
    },
    logsShowState() {
      if (this.logsCollection.lStatus === "error") {
        if (this.logsCollection.error.status !== 404) return "loadingError";
        return "empty";
      }
      if (this.logsCollection.dStatus === "present") {
        if (this.logs.length) return "data";
        return "empty";
      }
      if (this.logsCollection.lStatus === "loading") return "loading";
    },
    moreCount() {
      return Math.max(this.logs.length - this.logLimit, 0);
    },
    stageError() {
      return this.stage && this.stage.error;
    },
    isCollaborator() {
      return (
        (this.repo && this.repo.permissions && this.repo.permissions.write) || (this.user && this.user.admin) || false
      );
    },
    readyToDownload() {
      return this.step && this.step.stopped && this.logsShowState === "data";
    },
    showDeployButton() {
      return this.build && this.isBuildFinished(this.build) && this.isCollaborator;
    },
    showCancelButton() {
      return this.build && !this.isBuildFinished(this.build) && this.isCollaborator;
    }
  },
  methods: {
    getThemeByStatus: Status.getThemeByStatus,
    humanizeStatus: Status.humanizeStatus,
    isBuildFinished,
    handleCancel: function() {
      const { namespace, name, build } = this.$route.params;
      this.$store.dispatch("cancelBuild", { namespace, name, build });
    },
    handleDeploy: function(deployment) {
      const { namespace, name, build } = this.$route.params;
      this.$store.dispatch("createDeployment", { namespace, name, build, ...deployment }).then(data => {
        this.showDeploymentModal = false;
        this.$router.push(`/${namespace}/${name}/${data.build.number}`);
      });
    },
    handleDebug: function() {
      const { namespace, name, build } = this.$route.params;

      this.$store.dispatch("debugBuild", { namespace, name, build }).then(data => {
        this.$router.push(`/${namespace}/${name}/${data.build.number}`);
      });
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
    handleAll: function() {
      this.logLimit = this.logs.length;
    },
    openDeployModal: function() {
      this.showDeploymentModal = true;
    },
    closeDeployModal: function() {
      this.showDeploymentModal = false;
    },
    toggleOutputFullscreen() {
      this.outputFullscreen = !this.outputFullscreen;

      setTimeout(() => {
        if (this.outputFullscreen) this.$refs.outputContent.scrollTop = 0;
        this.actualizeShowToTop();
      }, 0);
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
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onScroll() {
      if (this.outputFullscreen) return;

      const delta = window.scrollY - previousScrollY;
      const { stages, output, outputHeader, visibilityFix } = this.$refs;

      previousScrollY = window.scrollY;

      if (stages) this.alignStages(stages, delta);
      if (output) this.actualizeShowToTop();
      if (output && outputHeader && visibilityFix) this.fixContentVisibilityInStickyOffset();
    },
    alignStages(stages, delta) {
      const stagesRect = stages.getBoundingClientRect();

      if (stagesRect.y <= STAGES_TOP_BREAKPOINT && window.innerHeight < stagesRect.height) {
        const bottomBreakpoint = window.innerHeight - stagesRect.height - STAGES_PADDING;
        const top = parseInt(stages.style.top || 0);

        // newTop = top - delta rounded by [STAGES_TOP_BREAKPOINT, bottomBreakpoint]
        const newTop = Math.max(Math.min(STAGES_TOP_BREAKPOINT, top - delta), bottomBreakpoint);

        stages.style.top = `${newTop}px`;
      }
    },
    fixContentVisibilityInStickyOffset() {
      const { output, outputHeader, visibilityFix } = this.$refs;
      const delta = outputHeader.offsetTop - output.offsetTop;

      visibilityFix.style.top = "-" + Math.min(delta + OUTPUT_HEADER_STICKY_OFFSET, 80) + "px";
    },
    onOutputContentScroll() {
      this.actualizeShowToTop();
    },
    actualizeShowToTop() {
      this.showToTop = this.outputFullscreen
        ? this.$refs.outputContent.scrollTop > 0
        : this.$refs.output.getBoundingClientRect().y < STAGES_TOP_BREAKPOINT;
    },
    approveBuild() {
      this.$store.dispatch("approveBuild", { ...this.$store.state.route.params, stage: this.stage.number });
    },
    declineBuild() {
      this.$store.dispatch("declineBuild", { ...this.$store.state.route.params, stage: this.stage.number });
    },
    loadLogsForStep(step) {
      if (!step) {
        console.warn("invalid step argument. loadLogsForStep skipped");
        return;
      }

      if (step.stopped) {
        this.$store.dispatch("fetchLogs", this.$route.params);
      } else if (step.started) {
        this.$store.dispatch("streamLogs", this.$route.params);
      }
    }
  },
  watch: {
    /**
     * Watches for changes to pipeline steps. If the step
     * is complete it dispatches a request to fetch the
     * logs. If the step changes to running status it
     * dispatches a request to stream the logs.
     */
    step: function(newStep, oldStep) {
      if (!newStep) {
        this.$store.commit("LOG_CLEAR");
        return;
      }

      // If a new step is loaded, dispatch a request to
      // fetch the completed step logs, or if the step
      // is running, dispatch a request to stream the logs.
      if (!oldStep || oldStep.id !== newStep.id) {
        this.$store.commit("LOG_CLEAR");

        this.follow = false;
        this.logLimit = 250;
        this.loadLogsForStep(newStep);

        // If the step remains the same, but a propery changes,
        // dispatch a request to stream logs if the step changes
        // from pending to started status.
      } else if (newStep.started > 0 && !oldStep.started) {
        this.$store.dispatch("streamLogs", this.$route.params);
      } else if (newStep.finished > 0 && this.logs.length === 0) {
        this.$store.dispatch("fetchLogs", this.$route.params);
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

.button-restart,
.button-cancel {
  min-width: 116px;
  text-align: left;

  svg {
    margin-top: 4px;
    float: right;
  }
}

.button-cancel svg {
  width: 15px;
  height: 15px;
  margin-top: 6.5px;
}

.button-source > svg {
  width: 24px;
}

.repo-item {
  margin-bottom: 20px;
  position: relative;
  z-index: 1; // box-shadow higher than .output-header-visibility-fix
}

.build-content {
  display: flex;
  align-items: flex-start;

  @include tablet {
    flex-direction: column;
  }
}

$stages-top: 20px;

.stages {
  flex: 0 0 270px;
  width: 270px;
  position: sticky;
  top: $header-height + $stages-top;
  min-width: 0; // important for white-space: nowrap
  z-index: 1; // Status' hint upper than .repo-item

  @include tablet {
    flex: 1 0 auto;
    width: 100%;
    margin-bottom: 20px;
    position: static;
  }
}

.stage-container + .stage-container {
  margin-top: 10px;
}

.stage-content {
  margin-left: 20px;
  flex-grow: 1;
  min-width: 0; // important for white-space: nowrap and text-overflow of .output-header

  .stage-error + .output {
    margin-top: 20px;
  }

  @include tablet {
    margin: 0;
    width: 100%;
  }
}

$output-border-radius: 6px;

.output {
  color: #fff;
  font-size: 12px;
  font-family: Menlo, Courier, monospace;
  font-weight: 300;
  background-color: $terminal-color;
  border-radius: $output-border-radius;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  box-sizing: border-box;
  padding: 0;
}

.output.show-to-top .to-top {
  display: block;
  margin-top: -30px;
}

.output-fullscreen {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: 0 !important;
  width: auto;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  box-shadow: none;

  .output-header-visibility-fix {
    display: none;
  }

  .output-header {
    position: static;
  }

  .output-content {
    overflow: auto;
  }

  .to-top {
    position: absolute;
    top: unset;
    bottom: 0;
    right: 0;
  }

  .output-lines tr:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .ol-html {
    word-break: break-word;
    white-space: pre-wrap;
    padding-right: 0;
  }

  .ol-time {
    display: table-cell;
  }
}

$output-header-before-z-index: 1;
$output-header-height: 40px;
$output-header-sticky-offset: 20px;

.output-header {
  position: sticky;
  top: $header-height + $output-header-sticky-offset;
  height: $output-header-height;
  min-height: $output-header-height;

  @include mobile {
    top: 0;
  }
}

.output-header-visibility-fix {
  position: absolute;
  top: -$output-header-sticky-offset;
  bottom: $output-header-height - $output-border-radius;
  left: -10px; // hide box-shadow of content
  right: -10px;
  background: $body-color;
  z-index: $output-header-before-z-index;
}

.output-header-content {
  position: relative;
  background: $terminal-color;
  padding: 0 5px 0 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 1px solid transparent;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 6px 6px 0 0;
  z-index: $output-header-before-z-index + 1;
  height: 100%;
}

.output-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px 0;
}

.output-title-stage {
  font-weight: bold;
  color: #fff;
}

.output-time-elapsed {
  flex: 1 0 auto;
  margin-left: 10px;
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
  padding: 15px 0;
}

.loading:after {
  animation-name: ellipsis;
}

@keyframes ellipsis {
  to {
    width: 28px;
  }
}

.output-lines {
  width: 100%;
  line-height: 19px;
  font-variant-ligatures: none;
}

.ol-pos,
.ol-time {
  color: #8c96a1;
  user-select: none;
  white-space: nowrap;
  width: 1px;
}

.ol-pos {
  padding: 0 10px 0 15px;
}

.ol-html {
  word-break: break-word;
  white-space: pre-wrap;
  padding-right: 15px;
}

.ol-time {
  display: none;
  padding: 0 15px 0 10px;
  text-align: right;
}

.output-content-actions {
  padding: 0 15px;
  margin-bottom: 15px;
  display: flex;
}

.output-content-actions .button:last-of-type {
  margin-left: 10px;
}

.output-button.button.outline.theme-default {
  width: 100%;
  background-color: rgba(216, 216, 216, 0.07);
  font-family: Menlo, Courier, monospace;
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
  background: $color-text;
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
</style>

<style lang="scss">
@import "../assets/styles/variables";

.stage-container > a {
  &:hover,
  &:focus {
    .stage {
      header {
        background: rgba($color-text, 0.02);
      }

      &.has-steps {
        time {
          display: none;
        }

        .arrow-dropdown {
          display: inline-block;
        }
      }
    }
  }
}

.step-container > a:hover,
.step-container > a:focus {
  outline: none;
  background-color: rgba($color-text, 0.02);
}

// prettier-ignore
.output-lines .ol-html {
  .ansi-black-fg { color: #5b5b5b; }
  .ansi-red-fg { color: $color-danger; }
  .ansi-green-fg { color: #4dca7e; }
  .ansi-yellow-fg { color: #c7b441; }
  .ansi-blue-fg { color: #2ba3d0; }
  .ansi-magenta-fg { color: #e948e9; }
  .ansi-cyan-fg { color: #4eeeee; }
  .ansi-black-bg { background-color: #404040; }
  .ansi-red-bg { background-color: rgba($color-danger, 0.3); }
  .ansi-green-bg { background-color: #76c84c; }
  .ansi-yellow-bg { background-color: #e8b73b; }
  .ansi-blue-bg { background-color: #3a5ad0; }
  .ansi-magenta-bg { background-color: #c440b6; }
  .ansi-cyan-bg { background-color: #32d2d9; }
  .ansi-white-bg { background-color: #aeaeae; }
}
</style>

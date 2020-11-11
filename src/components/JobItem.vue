<template>
  <section class="job-item" v-if="stage">
    <div class="container-left">
      <template v-if="stage.status">
        <Status :status="stage.status"/>
      </template>
    </div>
    <div class="content">
      <div class="header" :title="stage.name">
        <span class="title">
          <span>{{ stage.kind }}: </span>
          <span>{{ stage.name }}</span>
          <span class="info">
            <span class="label">type: {{stage.type}}</span>
            <span class="label" v-if="stage.os">os: {{ stage.os }}</span>
            <span class="label" v-if="stage.arch">arch: {{ stage.arch }}</span>
            <span class="label" v-if="stage.machine">machine: {{ stage.machine }}</span>
          </span>
        </span>

        <div class="time">
          <div v-if="showElapsedTime" class="time-elapsed">
            <Hint showOn="hover" align="center" position="bottom">Stage duration</Hint>
            <TimeElapsed :started="stage.started" :stopped="stage.finished"/>
          </div>
          <span v-if="showElapsedTime && stage.created" class="dot"></span>
          <span v-if="stage.created" class="time-started">
            <Hint showOn="hover" align="right" position="bottom">
              Stage started: {{ stage.created | moment(MOMENT_FULL_FORMAT) }}
            </Hint>
            {{ new Date(stage.created * 1000) | moment("from", "now") }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import Hint from "./Hint.vue";
import { MOMENT_FULL_FORMAT } from "@/lib/momentFormats";
import { isBuildFinished } from "@/lib/buildHelper";

export default {
  name: "JobItem",
  props: {
    stage: { type: Object, default: null }
  },
  components: {
    Status,
    TimeElapsed,
    Hint
  },
  data() {
    return {
      MOMENT_FULL_FORMAT
    };
  },
  computed: {
    showElapsedTime() {
      if (!this.stage.started) return false;
      return isBuildFinished(this.stage) ? !!this.stage.finished : !!this.stage.started;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.job-item {
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba($color-text, 0.1);
  border: solid 1px $border-color;
  background-color: #ffffff;
  color: $color-text;
  padding: 5px;
  transition: box-shadow linear 0.2s;
  min-height: 32px;

  @include mobile(true) {
    padding: 10px;

    .to {
      display: inline;
    }

    .time {
      margin: 5px 0 0 30px;
    }
  }
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  margin-top: 2px;

  .info {
    margin-left: 5px;
    font-size: 14px;
    color: $color-text-secondary;

    .label {
      background-color: rgba($color-primary, 0.07);
      color: $color-text;
      padding: 0 4px;
      border-radius: 2px;
      margin: 0 4px;
    }
  }
}

.header {
  height: 20px;
  font-size: 16px;
  line-height: normal;
  color: $color-text;
  display: flex;
  align-items: flex-start;
}

.container-left {
  width: 30px;
  position: absolute;
}

.status {
  margin-bottom: 5px;
  display: block;
  z-index: 2;
}

.content {
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
}

.time {
  flex-shrink: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-right: 10px;
  color: $color-text-secondary;
}

.time-started,
.time-elapsed {
  position: relative;

  .hint {
    white-space: nowrap;
  }
}

.time .dot {
  display: inline-block;
  width: 3px;
  height: 3px;
  background: rgba($color-text, 0.25);
  border-radius: 50%;
  margin: 0 6px;
}
</style>

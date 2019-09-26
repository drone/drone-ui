<template>
  <section class="repo-item"
           :class="{ [`build-${build ? 'yes' : 'no'}`]: true, [`active-${active ? 'yes' : 'no'}`]: true }">
    <div class="container-left">
      <template v-if="status">
        <Status :status="status"/>
        <div class="connector"></div>
      </template>

      <IconRepository v-else class="icon-repository"/>
    </div>

    <div class="content">
      <div class="header" :title="title">
        <span class="title">
          <span class="number" v-if="number">#{{ number }}. </span>
          <span>{{ title.split('\n')[0] }}</span>
        </span>

        <Button outline borderless
                v-if="!active && $store.state.mediaType !== 'mobile'"
                theme="primary"
                type="button"
                tabindex="-1">
          Activate
        </Button>
      </div>

      <div v-if="build" class="build">
        <img :src="avatar" alt="avatar"/>
        <div class="description">
          <span>{{author}}</span>
          <span> {{action}} </span>
          <RepoItemLabel type="actionTarget" :build="build" :repo="linkRepo" :link="!!linkRepo"/>
          <RepoItemLabel class="to" type="to" :build="build" :repo="linkRepo" :link="!!linkRepo" prefix=" to "/>
          <span class="commit-message" v-if="build.message" :title="build.message"> — {{ build.message }}</span>
        </div>

        <div class="time">
          <div v-if="showElapsedTime" class="time-elapsed">
            <Hint showOn="hover" align="center" position="bottom">Build duration</Hint>
            <TimeElapsed :started="build.started" :stopped="build.finished"/>
          </div>
          <span v-if="showElapsedTime && build.created" class="dot"></span>
          <span v-if="build.created" class="time-started">
            <Hint showOn="hover" align="right" position="bottom">
              Build started: {{ build.created | moment(MOMENT_FULL_FORMAT) }}
            </Hint>
            {{ new Date(build.created * 1000) | moment("from", "now") }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import RepoItemLabel from "./RepoItemLabel.vue";
import IconRepository from "@/components/icons/IconRepository.vue";
import Button from "@/components/buttons/Button.vue";
import Hint from "@/components/Hint.vue";
import { MOMENT_FULL_FORMAT } from "@/lib/momentFormats";
import { isBuildFinished } from "@/lib/buildHelper";

export default {
  name: "RepoItem",
  props: {
    active: { type: Boolean, default: true },
    number: Number,
    status: String,
    title: String,
    avatar: String,
    build: Object,
    linkRepo: Object
  },
  components: {
    Status,
    RepoItemLabel,
    TimeElapsed,
    IconRepository,
    Hint,
    Button
  },
  data() {
    return {
      MOMENT_FULL_FORMAT
    };
  },
  computed: {
    author() {
      if (this.build.event === "cron") return;
      return this.build.author_login;
    },
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      if (event === "rollback") return "reverted";
      if (event === "cron") return "executed scheduled task";
      return "pushed";
    },
    showElapsedTime() {
      if (!this.build.started) return false;
      return isBuildFinished(this.build) ? !!this.build.finished : !!this.build.started;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.repo-item {
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba($color-text, 0.1);
  border: solid 1px $border-color;
  background-color: #ffffff;
  color: $color-text;
  padding: 15px;
  transition: box-shadow linear 0.2s;

  @include mobile(true) {
    padding: 10px;

    .connector {
      width: 0;
      margin-top: -8px;
      height: 18px;
    }

    .header {
      font-size: 16px;
      line-height: 20px;
      padding-left: 30px;
    }

    .content {
      padding-left: 0;
    }

    .build {
      display: block;
      z-index: 1;
    }

    img {
      float: left;
    }

    .description {
      white-space: normal;
      margin-right: 0;
      line-height: 24px;

      .divider {
        display: block;
      }
    }

    .to {
      display: inline;
    }

    .time {
      margin: 5px 0 0 30px;
    }
  }

  &.repo-item.build-no.active-no .header .title {
    opacity: 0.6;
  }
}

.header {
  height: 22px;
  font-size: 18px;
  line-height: normal;
  color: $color-text;
  display: flex;
  align-items: flex-start;

  .button {
    letter-spacing: 1px;
    flex-shrink: 0;
    align-self: center;
  }
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  margin-top: -1px;
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

.connector {
  width: 15px;
  height: 15px;
  opacity: 0.2;
  border-bottom-left-radius: 8px;
  border-left: solid 1px $color-text;
  border-bottom: solid 1px $color-text;
  margin-left: 9px;
}

.icon-repository {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: $color-info;
  flex-shrink: 0;
}

.content {
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
}

.build {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $color-text-secondary;

  .header + & {
    margin-top: 6px;
  }
}

.build > img {
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.description {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
  color: $color-text-secondary;
  margin-right: 15px;

  .divider {
    height: 5px;
    display: none;
  }

  .commit-message {
    font-style: italic;

    .divider {
      height: 2px;
    }
  }
}

.page-builds-feed .description .commit-message {
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.time {
  flex-shrink: 0;
  display: flex;
  align-items: center;
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

<style lang="scss">
@import "../assets/styles/mixins";

.description .to .repo-item-label {
  display: inline-block;
  max-width: 35%;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-item {
  @include mobile(true) {
    .description .to .repo-item-label {
      max-width: none;
      display: inline;
      vertical-align: baseline;
    }
  }
}
</style>

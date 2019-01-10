<template>
  <Card slim :hoverable="hoverable"
        :class="{
          [`build-${build ? 'yes' : 'no'}`]: true,
          [`active-${active ? 'yes' : 'no'}`]: true,
          'repo-item': true
          }">
    <div class="container-left">
      <template v-if="status" >
        <Status :status="status"/>
        <div class="connector"></div>
      </template>

      <IconRepository v-else class="icon-repository"/>
    </div>

    <div class="content">
      <div class="header" :title="title">
        <span class="title">
          <span class="number" v-if="number">#{{ number }}. </span>
          <span>{{ title }}</span>
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
        <BuildDescription :build="build" :linkRepo="linkRepo"/>
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
  </Card>
</template>

<script>
import Status from "@/components/Status.vue";
import TimeElapsed from "@/components/TimeElapsed.vue";
import RepoItemLabel from "@/components/list-items/RepoItemLabel.vue";
import IconRepository from "@/components/icons/IconRepository.vue";
import Button from "@/components/buttons/Button.vue";
import Hint from "@/components/Hint.vue";
import { MOMENT_FULL_FORMAT } from "@/lib/momentFormats";
import { isBuildFinished } from "@/lib/buildHelper";
import BuildDescription from "@/components/list-items//BuildDescription";
import Card from "@/components/Card";

export default {
  name: "RepoItem",
  props: {
    hoverable: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    number: Number,
    status: String,
    title: String,
    avatar: String,
    build: Object,
    linkRepo: Object
  },
  components: {
    Card,
    BuildDescription,
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
    showElapsedTime() {
      return isBuildFinished(this.build) ? !!this.build.finished : !!this.build.started;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/mixins";

.repo-item {
  border-radius: 3px;
  box-sizing: border-box;
  color: #192d46;
  padding: 15px;

  @include mobile(true) {
    padding: 10px 15px;

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

    .build-description {
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
  color: #192d46;
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
  border-left: solid 1px #192d46;
  border-bottom: solid 1px #192d46;
  margin-left: 9px;
}

.icon-repository {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: #c6cbd1;
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
  color: rgba(25, 45, 70, 0.6);

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

.build-description {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 15px;
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
  background: rgba(25, 45, 70, 0.25);
  border-radius: 50%;
  margin: 0 6px;
}
</style>

<style lang="scss">
@import "../../assets/styles/mixins";

.build-description .to .repo-item-label {
  display: inline-block;
  max-width: 35%;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 0;
  padding-bottom: 0;
}

.repo-item {
  @include mobile(true) {
    .build-description .to .repo-item-label {
      max-width: none;
      display: inline;
      vertical-align: baseline;
    }
  }
}
</style>

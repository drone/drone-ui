<template>
  <section class="repo-item"
           :class="{ [`build-${build ? 'yes' : 'no'}`]: true, [`active-${active ? 'yes' : 'no'}`]: true }">
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
        <div class="description">
          <span>{{build.author_login}}</span>
          <span> {{action}} </span>
          <div class="divider media-only-mobile"/>
          <RepoItemLabel type="actionTarget" :build="build" :repo="linkRepo" :link="!!linkRepo"/>
          <RepoItemLabel class="to" type="to" :build="build" :repo="linkRepo" :link="!!linkRepo" prefix=" to "/>
          <span class="commit-message" v-if="build.message" :title="build.message">
            <span class="divider media-only-mobile"/>
            <span class="media-hide-mobile"> — </span>{{ build.message }}
          </span>
        </div>

        <div class="time">
          <TimeElapsed v-if="build.started" :started="build.started" :stopped="build.finished"/>
          <span v-if="build.started" class="dot"></span>
          <span>{{ new Date(build.created * 1000) | moment("from", "now") }}</span>
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
    Button
  },
  computed: {
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      return "pushed";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.repo-item {
  border-radius: 3px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  border: solid 1px #edeef1;
  background-color: #ffffff;
  color: #192d46;
  padding: 15px;
  transition: box-shadow linear 0.2s;

  @include mobile {
    padding: 10px;
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
  align-items: center;

  @include mobile {
    font-size: 16px;
    line-height: 20px;
  }

  .button {
    letter-spacing: 1px;
    flex-shrink: 0;
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
}

.connector {
  width: 15px;
  height: 15px;
  opacity: 0.2;
  border-bottom-left-radius: 8px;
  border-left: solid 1px #192d46;
  border-bottom: solid 1px #192d46;
  float: right;
  margin-right: 5px;
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

  @include mobile {
    display: block;
  }
}

.build > img {
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 10px;
  width: 20px;
  height: 20px;

  @include mobile {
    float: left;
  }
}

.description {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
  color: rgba(25, 45, 70, 0.6);
  margin-right: 15px;

  @include mobile {
    white-space: normal;
    margin-right: 0;
  }
}

.description {
  .divider {
    height: 5px;
  }

  .commit-message {
    font-style: italic;

    .divider {
      height: 2px;
    }
  }
}

.time {
  flex-shrink: 0;
  display: flex;
  align-items: center;

  @include mobile {
    margin: 5px 0 0 30px;
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
@import "../assets/styles/mixins";

.description .to .repo-item-label {
  display: inline-block;
  max-width: 35%;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;

  @include mobile {
    max-width: none;
    display: inline;
  }
}
</style>

<template>
  <section class="repo-item">
    <div class="container-left">
      <Status :status="status"/>
      <div class="connector"></div>
    </div>

    <div class="content">
      <div class="header" :title="title">
        <span class="number" v-if="number">#{{ number }}<span class="dash"> – </span></span>
        <span class="title">{{ title }}</span>
      </div>

      <div class="build">
        <img :src="avatar" alt="avatar"/>
        <div class="description">
          <span>{{build.author_login}}</span>
          <span> {{action}} </span>
          <RepoItemLabel type="actionTarget" :build="build" :repo="linkRepo" :link="!!linkRepo"/>
          <RepoItemLabel class="to" type="to" :build="build" :repo="linkRepo" :link="!!linkRepo" prefix=" to "/>
          <span class="commit-message" v-if="build.message" :title="build.message"> — {{ build.message }}</span>
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

export default {
  name: "RepoItem",
  props: {
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
    TimeElapsed
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

section {
  border-radius: 3px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
  border: solid 1px #edeef1;
  background-color: #ffffff;
  color: #192d46;
  padding: 15px;
  transition: box-shadow linear 0.2s;
}

.header {
  height: 22px;
  font-size: 18px;
  line-height: normal;
  color: #192d46;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.container-left {
  width: 30px;
  position: absolute;
}

.number .dash {
  color: rgba(25, 45, 70, 0.25);
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
  }
}

.description .commit-message {
  font-style: italic;
}

.time {
  flex-shrink: 0;
  display: flex;
  align-items: center;

  @include mobile {
    margin: 10px 0 0 30px;
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

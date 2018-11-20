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
        <img :src="avatar"/>
        <div class="description">
          <span>{{build.author_login}}</span>
          <span> {{action}} </span>
          <span class="label">{{actionTargetLabel}}</span>
          <span v-if="toLabel" class="to"> to <span class="label" :title="toLabel">{{ toLabel }}</span></span>
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

export default {
  name: "RepoItem",
  props: {
    number: Number,
    status: String,
    title: String,
    avatar: String,
    build: Object
  },
  components: {
    Status,
    TimeElapsed
  },
  computed: {
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      return "pushed";
    },
    actionTargetLabel() {
      const { event, ref } = this.build;
      if (event === "pull_request") return "#" + this.trimMergeRef(ref);
      if (event === "tag") return this.trimTagRef(ref);
      if (event === "promote") return this.branch;
      return this.commitShaShort;
    },
    toLabel() {
      const { event } = this.build;
      if (event === "push" || event === "pull_request") {
        return this.branch;
      }
    },
    commitShaShort() {
      return this.build.after && this.build.after.substr(0, 8);
    },
    branch() {
      return this.build.target;
    }
  },
  methods: {
    trimMergeRef: function(ref) {
      const match = ref.match(/\d/g);
      return match && match.length > 0 ? match[0] : ref;
    },
    trimTagRef: function(ref) {
      return ref.startsWith("refs/tags/") ? ref.substr(10) : ref;
    }
  }
};
</script>

<style scoped>
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
  color: rgba(25, 45, 70, 0.6);
  margin-right: 15px;
}

.description .label {
  line-height: 20px;
  background-color: rgba(5, 100, 215, 0.07);
  color: #0564d7;
  padding: 0 4px;
  border-radius: 2px;
}

.description .to .label {
  display: inline-block;
  max-width: 35%;
  vertical-align: bottom;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description .commit-message {
  font-style: italic;
}

.time {
  flex-shrink: 0;
  display: flex;
  align-items: center;
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

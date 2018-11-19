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

      <div class="metadata">
        <img :src="avatar"/>
        <div class="message">
          <span class="login">{{build.author_login}}</span>
          <span class="action"> {{action}} </span>
          <a class="actionTarget" :href="actionTarget.href" target="_blank"
             @click="onLinkCLick">{{actionTarget.label}}</a>
          <span v-if="to" class="to">
            to
            <a :href="to.href" target="_blank" @click.native="onLinkCLick">{{ to.label }}</a>
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

export default {
  name: "RepoItem2",
  props: {
    number: Number,
    status: String,
    title: String,
    avatar: String,
    build: Object,
    repoLink: { type: String, required: true }
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
    actionTarget() {
      const { event, ref, link } = this.build;
      if (event === "pull_request") return { href: this.prLink, label: "#" + this.trimMergeRef(ref) };
      if (event === "tag") return { href: link, label: this.trimTagRef(ref) };
      if (event === "promote") return { href: "#", label: this.branch };
      return { href: this.commitLink, label: this.commitShaShort };
    },
    to() {
      const { event } = this.build;
      if (event === "push" || event === "pull_request") {
        return { href: this.branchLink, label: this.branch };
      }
    },
    commitShaShort() {
      return this.build.after && this.build.after.substr(0, 8);
    },
    branch() {
      return this.build.target;
    },
    branchLink() {
      return `${this.repoLink}/tree/${this.branch}`;
    },
    commitLink() {
      return `${this.repoLink}/commit/${this.commitShaShort}`;
    },
    prLink() {
      return `${this.repoLink}/pull/${this.trimMergeRef(this.build.ref)}`;
    }
  },
  methods: {
    trimMergeRef: function(ref) {
      const match = ref.match(/\d/g);
      return match && match.length > 0 ? match[0] : ref;
    },
    trimTagRef: function(ref) {
      return ref.startsWith("refs/tags/") ? ref.substr(10) : ref;
    },
    onLinkCLick(e) {
      e.stopPropagation();
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

.metadata {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(25, 45, 70, 0.6);
}

.metadata > img {
  flex-shrink: 0;
  border-radius: 50%;
  margin-right: 10px;
  width: 20px;
  height: 20px;
}

.message {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
  color: rgba(25, 45, 70, 0.6);
  margin-right: 15px;
}

.message a {
  line-height: 20px;
  background-color: rgba(5, 100, 215, 0.07);
  color: #0564d7;
  padding: 0 3px;
}

.message a:focus,
.message a:hover {
  outline: none;
  background-color: rgba(5, 100, 215, 0.2);
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

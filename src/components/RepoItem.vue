<template>
    <section class="repo-item">
        <div class="container-left">
            <Status :status="status" />
            <div class="connector"></div>
        </div>
        <div class="content">
            <div class="header">
                <h3>
                    <span class="number" v-if="number">
                        #{{ number }}
                        <span class="dash">– </span>
                    </span>
                    <span class="title">{{ title }}</span>
                </h3>
                <span><slot></slot></span>
            </div>
            <div class="metadata" :class="[`align-${metaAlign}`]">
                <img :src="avatar" />
                <p class="message" :title="message">{{ message }}</p>

                <span class="finished" v-if="!hide.includes('finished')">
                    <IconCalendar />{{ new Date(build.created * 1000) | moment("from", "now") }}
                </span>
                <span class="duration" v-if="!hide.includes('duration')">
                    <IconClock /><TimeElapsed v-if="build.started" :started="build.started" :stopped="build.finished" />
                </span>
                <span class="commit" v-if="!hide.includes('commit')">
                    <IconCommit />
                    <a v-if="link" target="_blank" :href="link">{{ commitShaShort }}</a>
                    <span v-else>{{ commitShaShort }}</span>
                </span>
                <span class="branch">
                    <IconBranch v-if="build.event == 'push'" />
                    <IconMerge v-else-if="build.event == 'pull_request'" />
                    <IconTag v-else-if="build.event == 'tag'" />
                    <IconPromote v-else-if="build.event == 'promote'" />
                    <IconRollback v-else-if="build.event == 'rollback'" />
                    <IconBranch v-else />
                    <span :title="branchMetaValue">{{ branchMetaValue }}</span>
                </span>
            </div>
        </div>
    </section>
</template>

<script>
import IconClock from "./icons/IconClock.vue";
import IconCalendar from "./icons/IconCalendar.vue";
import IconCommit from "./icons/IconCommit.vue";
import IconBranch from "./icons/events/EventPush.vue";
import IconMerge from "./icons/events/EventPullRequest.vue";
import IconPromote from "./icons/events/EventPromote.vue";
import IconRollback from "./icons/events/EventRollback.vue";
import IconTag from "./icons/events/EventTag.vue";

import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";

export default {
  name: "RepoItem",
  props: {
    number: Number,
    status: String,
    message: String,
    title: String,
    link: String,
    author: String,
    avatar: String,
    build: Object,
    hide: { type: Array, default: () => [] },
    metaAlign: {
      type: String,
      default: "right",
      validator: val => ["right", "left"].includes(val)
    }
  },
  components: {
    IconBranch,
    IconCalendar,
    IconClock,
    IconCommit,
    IconMerge,
    IconPromote,
    IconRollback,
    IconTag,
    Status,
    TimeElapsed,
  },
  computed: {
    commitShaShort() {
      return this.build.after && this.build.after.substr(0, 8);
    },
    branch() {
      return this.build.target;
    },
    branchMetaValue() {
      const { event, ref } = this.build;
      return event === "pull_request" ? this.trimMergeRef(ref) : event === "tag" ? this.trimTagRef(ref) : this.branch;
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
  }
};

</script>

<style scoped>
section {
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
    border: solid 1px #EDEEF1;
    background-color: #ffffff;
    color: #192d46;
    padding: 13px 15px 15px;
}

.container-left {
    width: 30px;
    position: absolute;
    padding-top: 2px;
}

.number .dash {
  color: rgba(25, 45, 70, 0.25);
}

.status {
  margin-bottom: 5px;
}

.connector {
    width: 15px;
    height: 15px;
    opacity: 0.15;
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
    display: inline-flex;
    flex: 1;
    align-items: center;
}

.metadata.align-right .message {
  flex-grow: 1;
}

.metadata.align-right span.branch {
  flex: 0 0 150px;
}

.metadata.align-left .message {
  flex: 0 0 115px;
}

.metadata > span,
.metadata .message {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  font-size: 12px;
  line-height: normal;
  color: rgba(25, 45, 70, 0.5);
}

h3 {
  flex: 1;
  height: 22px;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

img {
    border-radius: 50%;
    margin-right: 7px;
    width: 18px;
    height: 18px;
}

.metadata svg {
  fill: #192d46;
  margin-right: 7px;
  height: 16px;
  width: 16px;
  opacity: 0.5;
  vertical-align: baseline;
  flex-shrink: 0;
}

.metadata > span {
  height: 24px;
  margin-left: 15px;
  border-left: 1px solid rgba(25, 45, 70, 0.05);
  padding-left: 15px;
  display: flex;
  align-items: center;
}

.metadata > span.finished {
  flex: 0 0 150px;
}

.metadata > span.commit {
  flex: 0 0 110px;
}
.metadata > span.duration {
  flex: 0 0 90px;
}

.metadata > span > span {
  text-overflow: ellipsis;
  overflow: hidden;
}

.metadata > span a {
    color: rgba(25, 45, 70, 0.5);
}

.metadata > span a:focus,
.metadata > span a:hover {
  color: #192d46;
  outline: none;
}

.header {
    display: flex;
    margin-bottom: 6px;
}
.header span {
    text-align: right;
}
</style>

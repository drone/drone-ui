<template>
    <section class="repo-item">
        <div class="container-left">
            <Status :status="status" />
            <div class="connector"></div>
        </div>
        <div class="content">
            <div class="header">
                <h3 v-if="namespace">{{ namespace }}/{{ name }}</h3>
                <h3 v-else>#{{ number }}. {{ title || message }}</h3>
                <span>
                    <slot></slot>
                </span>
            </div>
            <div class="metadata">
                <img :src="avatar" />
                <p v-if="namespace" v-bind:title="title || message">{{ title || message }}</p>
                <p v-else>{{ author }}</p>
                <span class="finished">
                    <IconCalendar />{{ new Date(created * 1000) | moment("from", "now") }}
                </span>
                <span class="duration">
                    <IconClock /><TimeElapsed v-if="started" :started="started" :stopped="finished" />
                </span>
                <span class="commit" v-if="link">
                    <IconCommit /><a v-if="link" target="_blank" :href="link">
                        {{ commit && commit.substr(0, 8) }}
                    </a>
                </span>
                <span class="commit" v-else>
                    <IconCommit />{{ commit && commit.substr(0, 8) }}
                </span>
                <span class="branch">
                    <IconBranch v-if="event == 'push'" />
                    <IconMerge v-else-if="event == 'pull_request'" />
                    <IconTag v-else-if="event == 'tag'" />
                    <IconPromote v-else-if="event == 'promote'" />
                    <IconRollback v-else-if="event == 'rollback'" />
                    <IconBranch v-else />
                    <span>{{
                      event === 'pull_request'
                      ? trimMergeRef(reference)
                      : event === 'tag'
                        ? trimTagRef(reference)
                        : branch
                    }}</span>
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
    namespace: String,
    name: String,
    number: Number,
    event: String,
    status: String,
    message: String,
    title: String,
    commit: String,
    branch: String,
    reference: String,
    created: Number,
    started: Number,
    finished: Number,
    link: String,
    author: String,
    avatar: String,
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

.container-left .status {
    height: 20px;
    width: 20px;
    margin-top: 1px;
}

.connector {
    width: 15px;
    height: 15px;
    opacity: 0.15;
    border-bottom-left-radius: 8px;
    border-left: solid 1px #192d46;
    border-bottom: solid 1px #192d46;
    float: right;
    margin-top: 5px;
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
    align-items: flex-end;
}

.metadata > span,
.metadata p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;

  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: rgba(25, 45, 70, 0.5);
}

.metadata p {
  flex-grow: 1;
  display: block;
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
  color: #0564d7;
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
  max-height: 16px;
  max-width: 16px;
  opacity: 0.5;
  vertical-align: baseline;
}

.metadata > span {
  height: 24px;
  margin-left: 15px;
  border-left: 1px solid rgba(25, 45, 70, 0.05);
  padding-left: 15px;
  display: flex;
  align-items: center;
}

.metadata > span.finished,
.metadata > span.branch {
  flex-basis: 150px;
}

.metadata > span.commit {
  flex-basis: 110px;
}
.metadata > span.duration {
  flex-basis: 90px;
}

.metadata > span > span {
  text-overflow: ellipsis;
  overflow: hidden;
}

.metadata > span a {
  color: #192d46;
}

.header {
    display: flex;
    margin-bottom: 6px;
}
.header span {
    text-align: right;
}
</style>

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
                <p v-if="namespace">{{ title || message }}</p>
                <p v-else>{{ author }}</p>
                <span class="finished">
                    <IconCalendar />
                    {{ new Date(created * 1000) | moment("from", "now") }}
                </span>
                <span class="duration">
                    <IconClock />
                    <TimeElapsed v-if="started" :started="started" :stopped="finished" />
                </span>
                <span class="commit" v-if="link">
                    <IconCommit />
                    <a v-if="link" target="_blank" :href="link">
                        {{ commit && commit.substr(0, 8) }}
                    </a>
                </span>
                <span class="commit" v-else>
                    <IconCommit />
                    {{ commit && commit.substr(0, 8) }}
                </span>
                <span class="branch">
                    <IconBranch v-if="event == 'push'" />
                    <IconMerge v-else-if="event == 'pull_request'" />
                    <IconTag v-else-if="event == 'tag'" />
                    <IconPromote v-else-if="event == 'promote'" />
                    <IconRollback v-else-if="event == 'rollback'" />
                    <IconBranch v-else />
                    {{ 
                      event === 'pull_request'
                      ? trimMergeRef(reference)
                      : event === 'tag'
                        ? trimTagRef(reference)
                        : branch
                    }}
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
    /* align-items: stretch; */
    /* align-items: flex-start; */
    /* background: #FFF;
    border: 1px solid #e8eaed;
    border-radius: 3px;
    color: #8d97a2;
    display: flex; */



    /* box-shadow: 0px 0px 8px 1px rgba(25, 45, 70, 0.05); */

    align-items: stretch;
    border-radius: 3px;
    box-sizing: border-box;
    box-shadow: 0px 1px 4px 1px rgba(25, 45, 70, 0.02);
    border: solid 1px rgba(25, 45, 70, 0.08);
    background-color: #ffffff;
    color: #192d46;
    display: flex;
    height: 80px;
    margin: 10px 0px;
    padding: 15px;
}

.container-left {
    width: 30px;
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
    display: flex;
    flex-direction: column;
    flex: 1;
}

.metadata {
    display: inline-flex;
    flex: 1;
    align-items: flex-end;
}

.metadata span,
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
  opacity: 0.5;
  color: #192d46;
  display: flex;
}

.metadata p {
    max-width: 250px;
    margin-right: 30px;
    flex: 1;
}


h3 {
  flex: 1;
  height: 22px;
  line-height: 22px;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #0564d7;
  /* max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}

img {
    border-radius: 50%;
    margin-right: 7px;
    width: 18px;
    height: 18px;
}

.metadata svg {
    fill: #192d46;
    height: 16px;
    margin-right: 10px;
    min-height: 16px;
    min-width: 16px;
    opacity: 0.5;
    width: 16px;
}


.metadata span {
    margin-left: 15px;
    border-right: 1px solid rgba(25, 45, 70, 0.25);
}

.metadata span.finished,
.metadata span.branch {
    width: 150px;
    max-width: 150px;
    min-width: 150px;
}

.metadata span:last-of-type {
    border: none;
}

.metadata span.commit {
    width: 110px;
    max-width: 110px;
    min-width: 110px;
}
.metadata span.duration {
    width: 90px;
    max-width: 90px;
    min-width: 90px;
}

.metadata span a {
  color: #192d46;
}

.header {
    display: flex;
}
.header span {
    text-align: right;
}
</style>

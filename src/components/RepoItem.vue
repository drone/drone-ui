<template>
    <section>
        <div class="gutter">
            <Status :status="status" />
        </div>
        <div class="content">
            <div class="header">
                <h3>{{ namespace }}/{{ name }}</h3>
            </div>
            <div class="metadata">
                <img :src="avatar" />
                <p>{{ message }}</p>
                <span class="finished">
                    <IconCalendar />
                    {{ new Date(created * 1000) | moment("from", "now") }}
                </span>
                <span class="duration">
                    <IconClock />
                    <TimeElapsed v-if="started" :started="started" :stopped="finished" />
                </span>
                <span class="commit">
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
                    {{ branch || reference.replace("refs/tags/") }}
                </span>
            </div>
        </div>
    </section>
</template>

<script>
import IconBranch from "./icons/IconBranch.vue";
import IconClock from "./icons/IconClock.vue";
import IconCalendar from "./icons/IconCalendar.vue";
import IconCommit from "./icons/IconCommit.vue";
import IconMerge from "./icons/IconMerge.vue";
import IconPromote from "./icons/IconPromote.vue";
import IconRollback from "./icons/IconRollback.vue";

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
    commit: String,
    branch: String,
    reference: String,
    created: Number,
    started: Number,
    finished: Number,
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
    Status,
    TimeElapsed,
  }
};
</script>

<style scoped>
section {
    align-items: stretch;
    background: #FFF;
    box-shadow: 0px 0px 8px 1px #e8eaed;
    border: 1px solid #e8eaed;
    border-radius: 3px;
    color: #8d97a2;
    display: flex;
    margin: 15px 0px;
    padding: 15px;
}

.gutter {
    width: 40px;
}

.status {
    background: #ff3e61;
    border-radius: 50%;
    width: 24px;
    height: 24px;
}

.status.success {
    background: #00d88a;
}

.status.pending,
.status.running {
    background: #ffd300;
}

.content {
    flex: 1;
}

h3 {
    color: #0064db;
    flex: 1;
    font-size: 15px;
    line-height: 24px;
    margin-bottom: 10px;
}

.metadata {
    align-items: center;
    display: inline-flex;
}

.metadata svg {
    fill: #8d97a2;
    height: 18px;
    margin-right: 10px;
    min-height: 18px;
    min-width: 18px;
    width: 18px;
}

.metadata span {
    align-items: center;
    display: flex;
    font-size: 13px;
    width: 125px;
    margin-right: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-right: 1px solid #EEE;
}
.metadata span:last-of-type {
    border: none;
}

.metadata span.finished {
    width: 150px;
}
.metadata span.commit {
    width: 110px;
}
.metadata span.duration {
    width: 90px;
}


.message {
    width: 100px;
    max-width: 100px;
}

p {
    box-sizing: border-box;
    font-size: 13px;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 10px;
    text-overflow: ellipsis;
}

img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin-right: 10px;
}
</style>

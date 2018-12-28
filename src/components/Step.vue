<template>
  <section :class="{ selected, step: true }">
    <Status :status="'running'"/>
    <span class="name" :title="name">{{ number }}. {{ name }}</span>
    <IconArrowDropdown v-if="selected" direction="right"/>
    <time-elapsed v-else-if="started" :started="started" :stopped="stopped"/>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import IconArrowDropdown from "./icons/IconArrowDropdown.vue";

export default {
  name: "Step",
  props: {
    name: String,
    number: Number,
    status: String,
    created: Number,
    started: Number,
    stopped: Number,
    selected: Boolean
  },
  components: {
    Status,
    TimeElapsed,
    IconArrowDropdown
  },
  computed: {
    duration() {
      return "";
    }
  }
};
</script>

<style scoped>
section {
  align-items: center;
  display: flex;
  padding: 0 15px;
  position: relative;
  height: 30px;
}

.status {
  flex-shrink: 0;
  z-index: 1;
}

.name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  margin-left: 10px;
  padding: 2px 0;
}

time {
  color: rgba(25, 45, 70, 0.6);
  text-align: right;
  flex-shrink: 0;
  margin-left: 10px;
}

.icon-arrow-dropdown {
  flex-shrink: 0;
  color: rgba(25, 45, 70, 0.6);
}

section.selected {
  background-color: rgba(25, 45, 70, 0.05);
}

section:after {
  content: " ";
  border-left: 1px solid rgba(25, 45, 70, 0.05);
  width: 1px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 24px;
}
</style>

<style>
.step > .status.status-running svg circle {
  fill: #fff;
}
</style>

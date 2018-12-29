<template>
  <section :class="{ selected, step: true }">
    <Status :status="status"/>
    <span class="name" :title="name">{{ name }}</span>
    <time-elapsed v-if="started" :started="started" :stopped="stopped"/>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";

export default {
  name: "Step",
  props: {
    name: String,
    status: String,
    created: Number,
    started: Number,
    stopped: Number,
    selected: Boolean
  },
  components: {
    Status,
    TimeElapsed
  },
  computed: {
    duration() {
      return "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.step {
  align-items: center;
  display: flex;
  padding: 0 15px;
  position: relative;
  height: 36px;

  &.selected {
    background-color: $step-selected-bg-color;
  }
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

<style lang="scss">
@import "../assets/styles/variables";

.step > .status.status-running svg circle {
  fill: #fff;
}

.step.selected > .status.status-running svg circle {
  fill: $step-selected-bg-color;
}
</style>

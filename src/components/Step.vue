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
  height: 40px;

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
  color: $color-text-secondary;
  text-align: right;
  flex-shrink: 0;
  margin-left: 10px;
  font-size: 13px;
}

.icon-arrow-dropdown {
  flex-shrink: 0;
  color: $color-text-secondary;
}

section:after {
  content: " ";
  border-left: 1px solid rgba($color-text, 0.1);
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

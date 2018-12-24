<template>
  <section class="stage">
    <header>
      <Status :status="status"/>
      <span>{{ name }}</span>
      <time-elapsed :started="started" :stopped="stopped" v-if="started"/>
      <IconArrowDropdown direction="down" class="arrow-dropdown"/>
    </header>
    <slot></slot>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import IconArrowDropdown from "./icons/IconArrowDropdown.vue";

export default {
  name: "Stage",
  props: {
    name: String,
    os: String,
    arch: String,
    version: String,
    variant: String,
    status: String,
    created: Number,
    started: Number,
    stopped: Number
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
.stage {
  background: #FFF;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, .05);
  border: 1px solid #edeef1;
  border-radius: 3px;
  box-sizing: border-box;
  color: #8d97a2;
  user-select: none;
}

header {
  align-items: center;
  border-bottom: solid 1px rgba(25, 45, 70, 0.08);
  box-sizing: border-box;
  display: flex;
  height: 45px;
  padding: 0 15px;
  user-select: none;
  max-width: 100%;
  color: #192d46;
}

.status {
  flex-shrink: 0;
}

span {
  flex-grow: 1;
  font-weight: 600;
  margin-left: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow-dropdown {
  display: none;
  color: rgba(25, 45, 70, 0.6);
}

a {
  display: block;
}

a:hover {
  background-color: #f8f8f9;
}
</style>

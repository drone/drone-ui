<template>
    <section v-bind:class="{ selected: selected, step: true }">
        <Status :status="status" outlined />
        <span>{{ name }}</span>
        <time-elapsed :started="started" :stopped="stopped" v-if="started" />
    </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";

export default {
  name: "Step",
  props: {
    name: String,
    number: Number,
    status: String,
    created: Number,
    started: Number,
    stopped: Number,
    selected: Boolean,
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

<style scoped>
section {
    align-items: center;
    color: #8d97a2;
    display: flex;
    padding: 15px;
    position: relative;
}

time,
span {
  margin-left: 10px;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

.status {
  flex-shrink: 0;
  z-index: 1;
}

span {
  flex-grow: 1;
}

time {
  color: rgba(25, 45, 70, 0.6);
  text-align: right;
  flex-shrink: 0;
}

section.selected {
  background-color: rgba(25, 45, 70, 0.03);
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

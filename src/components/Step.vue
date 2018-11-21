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
    height: 45px;
    padding: 0px 15px;
    position: relative;
}

time,
span {
  margin-left: 10px;
  flex: 1;
  height: 18px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

time {
  color: rgba(25, 45, 70, 0.6);
  text-align: right;
}

section.selected {
  background-color: rgba(25, 45, 70, 0.03);
}

section:after,
section:before {
    content: " ";
    border-left: 1px solid rgba(25, 45, 70, 0.05);
    width: 1px;
    height: 13px;
    position: absolute;
    top: 0px;
    left: 24px;
}

section:after {
    height: 12px;
    bottom: 0px;
    top: unset;
}
</style>

<template>
    <section v-bind:class="{ selected: selected }">
        <Status :status="status" :outlined="true" />
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
}

span {
    color: #243650;
    padding: 0px 15px;
    flex: 1;
    font-size: 14px;
}

section.selected {
    background: #f3f4f6;
}
</style>

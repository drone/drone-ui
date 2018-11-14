<template>
  <div v-bind:class="{ status: true, [`status-${status}`]: true, outlined }">
    <Blocked v-if="status === 'blocked'"/>
    <Failure v-if="status === 'failure'"/>
    <Failure v-if="status === 'killed'"/>
    <Failure v-if="status === 'error'"/>
    <Failure v-if="status === 'declined'"/>
    <Pending v-if="status === 'pending'"/>
    <Pending v-if="status === 'planned'"/>
    <Pending v-if="status === 'waiting_on_dependencies'"/>
    <Running v-if="status === 'running'"/>
    <Running v-if="status === 'started'"/>
    <Skipped v-if="status === 'skipped'"/>
    <Success v-if="status === 'success'"/>
  </div>
</template>

<script>
import Blocked from "./icons/status/StatusBlocked.vue";
import Failure from "./icons/status/StatusFailure.vue";
import Pending from "./icons/status/StatusPending.vue";
import Running from "./icons/status/StatusRunning.vue";
import Skipped from "./icons/status/StatusSkipped.vue";
import Success from "./icons/status/StatusSuccess.vue";

export default {
  name: "Status",
  props: {
    outlined: Boolean,
    status: String
  },
  components: {
    Blocked,
    Failure,
    Pending,
    Running,
    Skipped,
    Success
  }
};
</script>

<style scoped>
.status {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid transparent;
  color: #fff;
}

.status-success {
  background-color: #19D78C;
}

.status-success.outlined {
  border-color: #19D78C;
  color: #19D78C;
}

.status-running {
  background-color: #FFD20A;
}

.status-running.outlined {
  border-color: #FFD20A;
  color: #FFD20A;
}

.status-blocked,
.status-failure {
  background-color: #FF4164;
}

.status-blocked.outlined,
.status-failure.outlined {
  border-color: #FF4164;
  color: #FF4164;
}

.status-skipped,
.status-pending {
  background-color: #c6cbd1; /* = rgba(25, 45, 70, 0.25); */
}

.status-skipped.outlined,
.status-pending.outlined {
  border-color: #c6cbd1;
  color: #c6cbd1;
}

.outlined {
  background: transparent;
}

svg {
  position: absolute;
  height: 20px;
  width: 20px;
  top: -1px;
  left: -1px;
}
</style>

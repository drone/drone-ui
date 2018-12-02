<template>
  <div v-bind:class="{ status: true, [`status-${status}`]: true }" :title="status">
    <Blocked v-if="status === 'blocked'"/>
    <Failure v-if="status === 'failure'"/>
    <Cancelled v-if="status === 'killed'"/>
    <Failure v-if="status === 'error'"/>
    <Failure v-if="status === 'declined'"/>
    <Pending v-if="status === 'pending'"/>
    <Pending v-if="status === 'planned'"/>
    <Pending v-if="status === 'waiting_on_dependencies'"/>
    <Running v-if="status === 'running'"/>
    <Running v-if="status === 'started'"/>
    <Failure v-if="status === 'skipped'"/> <!-- a cross like in failure -->
    <Success v-if="status === 'success'"/>
  </div>
</template>

<script>
import Blocked from "./icons/status/StatusBlocked.vue";
import Failure from "./icons/status/StatusFailure.vue";
import Pending from "./icons/status/StatusPending.vue";
import Running from "./icons/status/StatusRunning.vue";
import Success from "./icons/status/StatusSuccess.vue";
import Cancelled from "./icons/status/StatusCancelled.vue";

export default {
  name: "Status",
  props: {
    status: String
  },
  components: {
    Blocked,
    Failure,
    Pending,
    Running,
    Success,
    Cancelled
  }
};
</script>

<style scoped>
.status {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  box-sizing: border-box;
  position: relative;
  border: 1px solid transparent;
  color: #fff;
}

.status-success {
  background-color: #19D78C;
}

.status-running {
  background-color: #FFD20A;
}

.status-blocked,
.status-killed,
.status-error,
.status-declined,
.status-failure {
  background-color: #FF4164;
}

.status-skipped,
.status-pending {
  background-color: #c6cbd1; /* = rgba(25, 45, 70, 0.25); */
}

svg {
  position: absolute;
  height: 20px;
  width: 20px;
  top: -1px;
  left: -1px;
}

.status-running > svg {
  animation: spin 3s linear infinite;
}

.status-pending > svg {
  animation: wrench 2.5s ease infinite;
}

@keyframes wrench {
	0%{transform:rotate(-12deg)}
	8%{transform:rotate(12deg)}
	10%{transform:rotate(24deg)}
	18%{transform:rotate(-24deg)}
	20%{transform:rotate(-24deg)}
	28%{transform:rotate(24deg)}
	30%{transform:rotate(24deg)}
	38%{transform:rotate(-24deg)}
	40%{transform:rotate(-24deg)}
	48%{transform:rotate(24deg)}
	50%{transform:rotate(24deg)}
	58%{transform:rotate(-24deg)}
	60%{transform:rotate(-24deg)}
	68%{transform:rotate(24deg)}
	75%,100%{transform:rotate(0deg)}
}
</style>

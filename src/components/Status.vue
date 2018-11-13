<template>
    <div v-bind:class="{ status: true, [status]: true, outlined: outlined }">
        <Blocked v-if="status === 'blocked'" />
        <Failure v-if="status === 'failure'" />
        <Failure v-if="status === 'killed'" />
        <Failure v-if="status === 'error'" />
        <Failure v-if="status === 'declined'" />
        <Pending v-if="status === 'pending'" />
        <Pending v-if="status === 'planned'" />
        <Pending v-if="status === 'waiting_on_dependencies'" />
        <Running v-if="status === 'running'" />
        <Running v-if="status === 'started'" />
        <Skipped v-if="status === 'skipped'" />
        <Success v-if="status === 'success'" />
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
}

svg {
  height: 20px;
  width: 20px;
}

.status.running svg {
  animation: spin 1s linear infinite;
}

.status.pending svg {
  animation: wrench 2.5s ease infinite;
}

@keyframes spin{
	0%{transform:rotate(0deg)}
	100%{transform:rotate(359deg)}
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

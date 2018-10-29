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
import Blocked from "./icons/Blocked.vue";
import Failure from "./icons/Failure.vue";
import Pending from "./icons/Pending.vue";
import Running from "./icons/Running.vue";
import Skipped from "./icons/Skipped.vue";
import Success from "./icons/Success.vue";

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
    Success,
  }
};

const STATUS_BLOCKED = "blocked";
const STATUS_DECLINED = "declined";
const STATUS_ERROR = "error";
const STATUS_FAILURE = "failure";
const STATUS_KILLED = "killed";
const STATUS_PENDING = "pending";
const STATUS_PLANNED = "planned";
const STATUS_RUNNING = "running";
const STATUS_SKIPPED = "skipped";
const STATUS_STARTED = "started";
const STATUS_SUCCESS = "success";
const STATUS_WAITING = "waiting_on_dependencies";
</script>

<style scoped>
.status {
    align-items: center;
    justify-content: center;
    background: #ff3e61;
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    height: 24px;
    width: 24px;
}

svg {
    fill: #FFF;
    height: 16px;
    width: 16px;
}

.status.success {
    background: #00d88a;
}

.status.waiting_on_dependencies,
.status.blocked,
.status.pending,
.status.running {
    background: #ffd300;
}

.status.skipped {
    background: #c5cad1;
}

/* outlined styles */

.status.outlined {
    background: none;
    border: 1px solid #ff3e61;
}

.status.outlined svg {
    fill: #ff3e61;
}

.status.success.outlined {
    border-color: #00d88a;
    color: #00d88a;;
}

.status.success.outlined svg {
    fill: #00d88a;
}

.status.waiting_on_dependencies.outlined,
.status.blocked.outlined,
.status.pending.outlined,
.status.running.outlined {
    border-color: #ffd300;
    color: #ffd300;
}

.status.waiting_on_dependencies.outlined svg,
.status.blocked.outlined svg,
.status.pending.outlined svg,
.status.running.outlined svg {
    fill: #ffd300;
}

.status.skipped.outlined {
    border-color: #c5cad1;
    color: #c5cad1;
}

.status.skipped.outlined svg {
    fill: #c5cad1;
}
</style>

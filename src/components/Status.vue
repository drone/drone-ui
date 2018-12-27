<template>
  <div v-bind:class="{ status: true, [`status-${status}`]: true }">
    <Hint showOn="hover">{{ statusHumanized }}</Hint>

    <Failure v-if="['failure', 'error'].includes(status)"/>
    <Cancelled v-else-if="['killed', 'skipped', 'declined'].includes(status)"/>
    <Pending v-else-if="['waiting_on_dependencies', 'pending', 'blocked'].includes(status)"/>
    <Success v-else-if="status === 'success'"/>
    <Running v-else-if="status === 'running'"/>
    <div class="no" v-else/>
  </div>
</template>

<script>
import Failure from "./icons/status/StatusFailure.vue";
import Pending from "./icons/status/StatusPending.vue";
import Running from "./icons/status/StatusRunning.vue";
import Success from "./icons/status/StatusSuccess.vue";
import Cancelled from "./icons/status/StatusCancelled";
import Hint from "@/components/Hint";

import * as validators from "@/lib/validators";

const STATUSES = [
  "failure", "error",
  "killed", "skipped", "declined",
  "waiting_on_dependencies", "pending", "blocked",
  "success",
  "running"
];

export default {
  name: "Status",
  props: {
    status: { type: String, required: true, validator: validators.oneOf(STATUSES) }
  },
  components: {
    Failure,
    Pending,
    Running,
    Success,
    Cancelled,
    Hint
  },
  computed: {
    statusHumanized() {
      if (this.status === "waiting_on_dependencies") {
        return "Waiting on dependencies";
      }

      if (this.status === "killed") {
        return "Killed (cancelled)";
      }

      return this.status[0].toLocaleUpperCase() + this.status.substr(1);
    }
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
  color: #ffc800;
  background-color: transparent;
}

.status-skipped,
.status-killed,
.status-declined,
.status-error,
.status-failure {
  background-color: #FF4164;
}

.status-waiting_on_dependencies,
.status-pending,
.status-blocked {
  background-color: #c6cbd1; /* = rgba(25, 45, 70, 0.25); */
}

.hint {
  white-space: nowrap;
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

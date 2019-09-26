<template>
  <div :class="{ status: true, [`status-${status}`]: true, [`theme-${theme}`]: true }">
    <Hint showOn="hover" :offset="-7.5">{{ statusHumanized }}</Hint>

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

const DANGER_THEME_STATUSES = ["failure", "error", "killed"];
const INFO_THEME_STATUSES = ["skipped", "declined", "waiting_on_dependencies", "pending", "blocked"];
const WARNING_THEME_STATUSES = ["running"];
const SUCCESS_THEME_STATUSES = ["success"];

const STATUSES = [
  ...DANGER_THEME_STATUSES,
  ...INFO_THEME_STATUSES,
  ...WARNING_THEME_STATUSES,
  ...SUCCESS_THEME_STATUSES
];

function humanizeStatus(status) {
  if (status === "waiting_on_dependencies") {
    return "Waiting on dependencies";
  }

  if (status === "killed") {
    return "Killed (cancelled)";
  }

  return status[0].toLocaleUpperCase() + status.substr(1);
}

function getThemeByStatus(status) {
  if (DANGER_THEME_STATUSES.includes(status)) return "danger";
  if (WARNING_THEME_STATUSES.includes(status)) return "warning";
  if (SUCCESS_THEME_STATUSES.includes(status)) return "success";
  return "info";
}

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
      return humanizeStatus(this.status);
    },
    theme() {
      return getThemeByStatus(this.status);
    }
  },
  humanizeStatus,
  getThemeByStatus
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

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

.theme-success {
  background-color: $color-success;
}

.theme-danger {
  background-color: $color-danger;
}

.theme-info {
  background-color: $color-info;
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

.status-running {
  color: $color-warning;
  background-color: transparent;

  > svg {
    animation: spin 3.3333s linear infinite;
  }
}

.status-pending > svg {
  animation: wrench 2.5s ease infinite;
}

@keyframes wrench {
  0% {
    transform: rotate(-12deg);
  }
  8% {
    transform: rotate(12deg);
  }
  10% {
    transform: rotate(24deg);
  }
  18% {
    transform: rotate(-24deg);
  }
  20% {
    transform: rotate(-24deg);
  }
  28% {
    transform: rotate(24deg);
  }
  30% {
    transform: rotate(24deg);
  }
  38% {
    transform: rotate(-24deg);
  }
  40% {
    transform: rotate(-24deg);
  }
  48% {
    transform: rotate(24deg);
  }
  50% {
    transform: rotate(24deg);
  }
  58% {
    transform: rotate(-24deg);
  }
  60% {
    transform: rotate(-24deg);
  }
  68% {
    transform: rotate(24deg);
  }
  75%,
  100% {
    transform: rotate(0deg);
  }
}
</style>

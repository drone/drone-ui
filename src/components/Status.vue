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
svg {
  height: 20px;
  width: 20px;
}
</style>

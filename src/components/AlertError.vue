<template>
  <Alert v-if="error">{{ humanErrorMessage(error) }}</Alert>
</template>

<script>
import Alert from "@/components/Alert.vue";

import { humanErrorMessage } from "@/lib/formatError";

export default {
  name: "AlertError",
  components: {
    Alert
  },
  props: {
    error: Object
  },
  methods: {
    humanErrorMessage
  }
};
</script>
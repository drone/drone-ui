<template>
  <Card :class="{ [`theme-${theme}`]: true }" contentPadding="45px">
    <slot></slot>
    <div class="secondary" v-if="$slots.secondary"><slot name="secondary"></slot></div>
  </Card>
</template>

<script>
import Card from "@/components/Card.vue";

export default {
  name: "Alert",
  components: {
    Card
  },
  props: {
    theme: String
  }
};
</script>

<style scoped>
.card {
  text-align: center;
}

.secondary {
  color: rgba(25, 45, 70, 0.6);
  margin-top: 8px;
}

.theme-success {
  color: #00d88a;
}

.theme-info {
}

.theme-warning {
}

.theme-error {
  color: #ff3e61;
}
</style>

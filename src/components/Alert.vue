<template>
  <Card :class="{ [`theme-${theme}`]: true }" v-bind="cardProps" contentPadding="45px">
    <!--todo remove cardProps-->
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
    theme: String,
    cardProps: Object
  }
};
</script>

<style scoped>
.card {
  font-size: 15px;
  text-align: center;
}

.secondary {
  color: rgba(25, 45, 70, 0.6);
  font-size: 14px;
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

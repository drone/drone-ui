<template>
  <Card class="alert" :class="{ [`theme-${theme}`]: true }" :contentPadding="`${contentPadding}px`">
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
  },
  computed: {
    contentPadding() {
      return this.theme === "danger" ? 11.5 : 45;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

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

.theme-danger {
  background-color: $color-danger;
  color: #fff;
  font-weight: 600;
  line-height: normal;
}
</style>

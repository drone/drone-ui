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
      return this.theme ? 11.5 : 45;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.card {
  text-align: center;
  word-wrap: break-word;
}

.secondary {
  color: $color-text-secondary;
  margin-top: 8px;
}

.theme-info,
.theme-warning,
.theme-danger,
.theme-success {
  color: #fff;
  font-weight: 600;
  line-height: normal;
}

.theme-success {
  background-color: $color-success;
}

.theme-info {
  background-color: $color-info;
}

.theme-warning {
  background-color: $color-warning;
}

.theme-danger {
  background-color: $color-danger;
}
</style>

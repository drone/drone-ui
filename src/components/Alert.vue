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
@import "../assets/styles/mixins";

.card {
  text-align: center;
  word-wrap: break-word;
}

.secondary {
  margin-top: 8px;
  @include themed {
    color: tget("color-text-secondary");
  }
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
  @include themed {
    background-color: tget("color-success");
  }
}

.theme-info {
  @include themed {
    background-color: tget("color-info");
  }
}

.theme-warning {
  @include themed {
    background-color: tget("color-warning");
  }
}

.theme-danger {
  @include themed {
    background-color: tget("color-danger");
  }
}
</style>

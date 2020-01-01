<template>
  <router-view />
</template>

<script>
import { applySavedTheme } from "@/lib/theme";

export default {
  mounted() {
    applySavedTheme();
  }
};
</script>

<style lang="scss">
@import "./assets/styles/reset.scss";
@import "./assets/styles/global.scss";
</style>

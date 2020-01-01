<template>
  <UserMenuSection>
    <div class="left" @click.stop.prevent="">
      <p>Dark theme</p>
      <span>Dark theme setting will apply to this browser only</span>
    </div>
    <template slot="right">
      <BaseSwitch v-model="darkThemeEnabled"></BaseSwitch>
    </template>
  </UserMenuSection>
</template>

<script>
import UserMenuSection from "@/components/UserMenuSection.vue";
import BaseSwitch from "@/components/forms/BaseSwitch.vue";
import { THEME, applyDarkTheme, fetchSavedTheme } from "@/lib/theme";

export default {
  name: "DarkThemeControl",
  components: {
    UserMenuSection,
    BaseSwitch
  },
  mounted() {
    this.darkThemeEnabled = fetchSavedTheme() === THEME.DARK;
  },
  data() {
    return {
      darkThemeEnabled: true
    };
  },
  watch: {
    darkThemeEnabled: enabled => applyDarkTheme(enabled)
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.left {
  display: flex;
  flex-direction: column;
  white-space: normal;
  margin-right: 20px;
  line-height: 20px;

  p {
    font-weight: bold;
    margin-bottom: 7px;
  }

  span {
    @include themed {
      color: tget("color-text-secondary");
    }
  }
}
</style>

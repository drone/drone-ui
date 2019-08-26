<template>
  <div class="wrap">
    <Title/>

    <slot name="header"></slot>

    <div class="layout-content">
      <div class="layout-content-center">
        <main class="container"><slot></slot></main>

        <Footer />
      </div>

      <BuildsFeedPanel v-if="$store.state.mediaType === 'desktop' && $store.getters.userPresent" />
    </div>

    <SystemAlert v-if="isLicenseExpired">Your Server License Is Expired <a href="https://docs.drone.io/license-is-expired" target="_blank">Learn More</a></SystemAlert>
    <SystemAlert v-if="isLicenseExceeded">Your License Limit Is Exceeded <a href="https://docs.drone.io/license-is-exceeded" target="_blank">Learn More</a></SystemAlert>

    <Notifications/>

    <portal-target name="body"/>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import SystemAlert from "./SystemAlert.vue";
import Notifications from "@/components/Notifications.vue";
import BuildsFeedPanel from "@/components/BuildsFeedPanel";
import Title from "@/components/utils/Title";

export default {
  name: "BaseLayout",
  components: {
    Title,
    Footer,
    Notifications,
    BuildsFeedPanel,
    SystemAlert
  },
  computed: {
    isLicenseExceeded() {
      return window && window.LICENSE_LIMIT_EXCEEDED;
    },
    isLicenseExpired() {
      return window && window.LICENSE_EXPIRED;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.container {
  padding-bottom: 60px;
  flex-grow: 1;
  min-width: 0; // important for children with white-space: nowrap

  @include mobile {
    padding-bottom: 40px;
  }
}

.wrap {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;

  @include mobile {
    position: absolute;
  }
}

.layout-content {
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  display: flex;
  padding-top: $header-height;
}

.layout-content-center {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  width: 100%;
  // Hack for proper truncating as per https://github.com/drone/drone-ui/issues/275
  @include tablet {
    width: 100vw;
  }
}

footer {
  flex-shrink: 0;
}
</style>

<style lang="scss">
/* todo: decide could we move it to scoped style */
@import "../assets/styles/mixins";

.container {
  box-sizing: border-box;
  max-width: 980px;
  padding: 0 15px;
  margin: 0 auto;

  @include mobile {
    padding: 0 10px;
  }
}
body {
  /* hack for better font rendering on macos
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   */
}
</style>

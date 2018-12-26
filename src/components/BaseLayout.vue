<template>
  <div class="wrap">
    <slot name="header"></slot>

    <main id="base-layout-main">
      <div class="container">
        <slot></slot>
      </div>
      <BuildsFeedPanel v-if="$store.state.mediaType === 'desktop'" />
    </main>

    <Footer />

    <Notifications/>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import Notifications from "@/components/Notifications.vue";
import BuildsFeedPanel from "@/components/BuildsFeedPanel";

export default {
  name: "BaseLayout",
  components: {
    Footer,
    Notifications,
    BuildsFeedPanel
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.container {
  padding-bottom: 80px;
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

main {
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  display: flex;
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
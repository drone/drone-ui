<template>
  <div class="wrap">
    <Title/>

    <slot name="header"></slot>

    <main id="base-layout-main">
      <div class="container">
        <slot></slot>
      </div>
      <BuildsFeedPanel v-if="$store.state.mediaType === 'desktop' && $store.getters.userPresent" />
    </main>

    <Footer />

    <Notifications/>
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import Notifications from "@/components/Notifications.vue";
import BuildsFeedPanel from "@/components/BuildsFeedPanel";
import Title from "@/components/utils/Title";

export default {
  name: "BaseLayout",
  components: {
    Title,
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

main {
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
  display: flex;
  padding-top: $header-height;
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
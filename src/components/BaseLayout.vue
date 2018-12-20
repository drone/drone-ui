<template>
  <div class="wrap">
    <header>
      <slot name="header"></slot>
    </header>

    <main>
      <div class="container">
        <slot></slot>
      </div>
    </main>

    <Footer />

    <Notifications/>
    <BuildsFeedPanel/>
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

  @include mobile {
    padding-bottom: 40px;
  }
}

.wrap {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

header {
  box-shadow: 0 2px 6px 0px rgba(25, 45, 70, 0.05);
  box-sizing: border-box;
  height: 60px;
  background: #FFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1; // upper than Panel
}

main {
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
}

footer {
  flex-shrink: 0;
}

.panel {
  padding: 0 20px;
}
</style>

<style lang="scss">
/* todo: decide could we move it to scoped style */
@import "../assets/styles/mixins";

.container {
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
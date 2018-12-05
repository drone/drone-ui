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
  </div>
</template>

<script>
import Footer from "./Footer.vue";
import Notifications from "@/components/Notifications.vue";

export default {
  name: "BaseLayout",
  components: {
    Footer,
    Notifications
  }
};
</script>

<style scoped>
.container {
  padding-bottom: 80px;
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
}

main {
  box-sizing: border-box;
  position: relative;
  flex-grow: 1;
}

footer {
  flex-shrink: 0;
}
</style>

<style>
.container {
  max-width: 980px;
  padding: 0 15px;
  margin: 0 auto;
}
body {
  /* hack for better font rendering on macos
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   */
}
</style>
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <Footer />
  </div>
</template>

<script>
import Footer from "./Footer.vue";

export default {
  name: "BaseLayout",
  components: {
    Footer,
  }
};
</script>

<style scoped>
.container {
  min-height: 100%;
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: 60px auto 60px;
}

.container > header {
  box-shadow: 0px 0px 8px 2px #e8eaed;
  box-sizing: border-box;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  background: #FFF;
  grid-column: 1;
  grid-row: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.container > footer {
  box-shadow: 0 -8px 8px -8px #e8eaed;
  box-sizing: border-box;
  height: 60px;
  min-height: 60px;
  max-height: 60px;
  background: #FFF;
  grid-column: 1;
  grid-row: 3;
}

.content > main {
  box-sizing: border-box;
  grid-area: content;
  position: relative;
  grid-column: 1;
  grid-row: 2;
}

.container > main > div:first-of-type {
  margin: 0px auto;
  max-width: 900px;
  padding: 30px 0px;
}
</style>

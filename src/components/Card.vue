<template>
  <section class="card">
    <header v-if="$slots.header"><slot name="header"></slot></header>
    <div class="content" :style="contentStyle"><slot></slot></div>
    <footer v-if="$slots.footer"><slot name="footer"></slot></footer>
  </section>
</template>

<script>
export default {
  name: "Card",
  props: {
    header: String,
    contentPadding: { type: String, default: "15px" }
  },
  computed: {
    contentStyle() {
      return { padding: this.contentPadding };
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

section {
  border-radius: 3px;
  box-sizing: border-box;
  border: solid 1px #edeef1;
  background: #ffffff;
  box-shadow: 0 2px 4px 0 $border-color;
}

header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid $border-color;
  padding: 0 15px;
  display: flex;
  align-items: center;
}

footer {
  background-color: rgba($color-text, 0.02);
  border-top: 1px solid $border-color;
  padding: 15px;
}
</style>

<style>
.card > header > h2,
.card > header > h3 {
  font-size: 16px;
  font-weight: 600;
}
</style>

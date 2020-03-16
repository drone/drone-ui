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
@import "../assets/styles/mixins";

section {
  border-radius: 3px;
  box-sizing: border-box;
  @include themed {
    background: tget("surface-color");
  }
  @include themed-only(default) {
    border: solid 1px #edeef1;
    box-shadow: 0 2px 4px 0 $border-color;
  }
  @include themed-only(dark) {
    box-shadow: 0 2px 4px 0 darken(tget("body-color"), 20%);
  }
}

header {
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  @include themed {
    border-bottom: 1px solid tget("border-color");
  }
}

footer {
  padding: 15px;
  @include themed {
    border-top: 1px solid tget("border-color");
    background-color: rgba(tget("color-text"), 0.02);
  }
}
</style>

<style>
.card > header > h2,
.card > header > h3 {
  font-size: 16px;
  font-weight: 600;
}
</style>

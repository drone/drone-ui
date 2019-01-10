<template>
  <section :class="{ card: true, hoverable }">
    <slot v-if="slim"/>

    <template v-else>
      <header v-if="$slots.header"><slot name="header"></slot></header>
      <div class="card-content" :style="contentStyle"><slot></slot></div>
      <footer v-if="$slots.footer"><slot name="footer"></slot></footer>
    </template>
  </section>
</template>

<script>
export default {
  name: "Card",
  props: {
    header: String,
    contentPadding: { type: String },
    slim: { type: Boolean, default: false },
    hoverable: { type: Boolean, default: false }
  },
  computed: {
    contentStyle() {
      return this.contentPadding ? { padding: this.contentPadding } : null;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.card {
  border-radius: 3px;
  box-sizing: border-box;
  border: solid 1px #EDEEF1;
  background: #fff;
  box-shadow: $box-shadow;

  &.hoverable {
    transition: box-shadow linear 0.2s;

    @include hf {
      box-shadow: $box-shadow-hover;
    }
  }
}

header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid rgba(25, 45, 70, 0.05);
  padding: 0 15px;
  display: flex;
  align-items: center;
}

.card-content {
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}

footer {
  background-color: rgba(25, 45, 70, 0.03);
  border-top: 1px solid rgba(25, 45, 70, 0.05);
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

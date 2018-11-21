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

<style scoped>
section {
  border-radius: 3px;
  box-sizing: border-box;
  border: solid 1px #EDEEF1;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, 0.05);
}

header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid rgba(25, 45, 70, 0.05);
  padding: 0 15px;
  font-size: 16px;
  font-weight: 600;
}

.content {
  padding: 15px;
}

footer {
  background-color: rgba(25, 45, 70, 0.03);
  border-top: 1px solid rgba(25, 45, 70, 0.05);
  padding: 15px;
}
</style>

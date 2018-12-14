<template>
  <div class="builds-feed-indicator" :class="{ [`status-${status}`]: true, filled }">
    <div class="border"></div>
    <div class="label">{{ loaded ? count : '-' }}</div>
  </div>
</template>

<script>
export default {
  name: "BuildsFeedIndicator",
  props: {
    collection: Object,
    filled: Boolean
  },
  computed: {
    loaded() {
      return this.collection.status === "loaded";
    },
    status() {
      return this.count > 0 ? "running" : "done";
    },
    count() {
      return this.collection.data.length;
    }
  }
};
</script>

<style scoped>
.builds-feed-indicator {
  cursor: pointer;
  position: relative;
}

.builds-feed-indicator.status-done .label {
  color: rgba(25, 45, 70, 0.25);
}

.builds-feed-indicator.status-running .border {
  border-color: #ffd20a;
  border-bottom-color: transparent;
  animation: spin 1s linear infinite;
}

.builds-feed-indicator.status-running .label {
  color: #ffd20a;
}

.builds-feed-indicator.status-running.filled .border {
  background-color: #ffd20a;
}

.builds-feed-indicator.filled .border {
  background-color: rgba(25, 45, 70, 0.25);
  border: none;
  animation: none;
}

.builds-feed-indicator.filled .label {
  color: #fff;
}

.border {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  border: 1px solid rgba(25, 45, 70, 0.25);
}

.label {
  top: 0;
  width: 30px;
  height: 30px;
  position: absolute;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
</style>

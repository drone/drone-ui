<template>
  <div class="builds-feed-indicator" :class="{ [`status-${status}`]: true, filled }">
    <Hint v-if="mediaType === 'desktop'" position="bottom" showOn="hover">
      Recent builds ({{count}} active)
    </Hint>
    <div class="border"></div>
    <div class="label">{{ loaded ? count : "-" }}</div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";

export default {
  name: "BuildsFeedIndicator",
  components: {
    Hint
  },
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
    },
    mediaType() {
      return this.$store.state.mediaType;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.builds-feed-indicator {
  cursor: pointer;
  position: relative;
  display: inline-block;
}

.builds-feed-indicator.status-done {
  .label {
    color: #fff;
  }

  .border {
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &.filled .border {
    background-color: #fff;
  }
}

.builds-feed-indicator.status-running {
  .border {
    border: 2px solid #ffd20a;
    border-bottom-color: transparent;
    animation: spin 1s linear infinite;
  }

  .label {
    color: #ffd20a;
  }

  &.filled .border {
    background-color: #ffd20a;
  }
}

.builds-feed-indicator.filled .label {
  color: $color-header;
}

.hint {
  white-space: nowrap;
  right: -50px;
}

.border {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  background-color: $color-header;
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

<style>
.builds-feed-indicator > .hint > .triangle {
  right: 60px;
  left: auto;
}
</style>

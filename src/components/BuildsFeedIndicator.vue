<template>
  <div class="builds-feed-indicator" :class="{ [`status-${status}`]: true, filled }">
    <Hint v-if="mediaType === 'desktop'" position="bottom" showOn="hover">
      Recent builds ({{count}} active)
    </Hint>
    <IconGear class="gear"/>
    <div class="label">{{ loaded ? count : "-" }}</div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import IconGear from "@/components/icons/IconGear";

export default {
  name: "BuildsFeedIndicator",
  components: {
    Hint,
    IconGear
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

  &.filled .label {
    color: $header-color;
  }
}

.builds-feed-indicator.status-running {
  .label {
    color: #ffd20a;
  }

  &.filled .label {
    color: $header-color;
  }
}

.hint {
  white-space: nowrap;
  right: -50px;
}

.gear {
  width: 30px;
  height: 30px;
}

.label {
  top: 0;
  width: 30px;
  height: 30px;
  position: absolute;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-style: italic;
  font-weight: 600;
}
</style>

<style lang="scss">
@import "../assets/styles/variables";

.builds-feed-indicator > .hint > .triangle {
  right: 60px;
  left: auto;
}

.builds-feed-indicator .gear > g {
  fill: $header-color;
}

.builds-feed-indicator.status-done {
  .gear {
    .line {
      fill: #fff;
      fill-opacity: 0.3;
    }

    .bg {
      fill: $header-color;
    }
  }

  &.filled .gear {
    .line,
    .bg {
      fill: #fff;
      fill-opacity: 1;
    }
  }
}

.builds-feed-indicator.status-running {
  .gear {
    animation: spin 5s linear infinite;

    .line {
      fill: #ffd20a;
      fill-opacity: 1;
    }

    .bg {
      fill: $header-color;
    }
  }

  &.filled .gear {
    .line,
    .bg {
      fill: #ffd20a;
      fill-opacity: 1;
    }
  }
}
</style>

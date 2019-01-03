<template>
  <div class="builds-feed-indicator" :class="{ [`status-${status}`]: true, filled }">
    <Hint v-if="mediaType === 'desktop'" position="bottom" showOn="hover" align="right" :offset="-45">
      Recent builds ({{count}} active)
    </Hint>
    <IconGear class="gear"/>
    <div class="circle"/>
    <div class="label">{{ loaded ? count : "-" }}</div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import IconGear from "@/components/icons/IconGear";
import favicon from "@/lib/favicon";

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
  },
  watch: {
    status(nextValue) {
      favicon.setState(nextValue === "done" ? "default" : "running");
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

.hint {
  white-space: nowrap;
}

.gear {
  width: 30px;
  height: 30px;
}

.circle {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.label {
  top: 0;
  width: 30px;
  height: 30px;
  position: absolute;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
</style>

<style lang="scss">
@import "../assets/styles/variables";

.builds-feed-indicator .gear > g {
  fill: $header-color;
}

.builds-feed-indicator.status-done {
  .gear {
    display: none;
  }

  .circle {
    background-color: $header-color;
  }

  .label {
    color: #fff;
  }

  &.filled {
    .circle {
      background: white;
    }

    .label {
      color: $header-color;
    }
  }
}

.builds-feed-indicator.status-running {
  .gear {
    animation: spin 5s linear infinite;

    .line {
      fill: $color-warning;
      fill-opacity: 1;
    }

    .bg {
      fill: $header-color;
    }
  }

  .circle {
    display: none;
  }

  .label {
    color: $color-warning;
  }

  &.filled {
    .gear {
      .line,
      .bg {
        fill: $color-warning;
        fill-opacity: 1;
      }
    }

    .label {
      color: #fff;
    }
  }
}
</style>

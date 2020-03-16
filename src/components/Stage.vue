<template>
  <section :class="{ stage: true, 'has-steps': hasSteps, 'has-content': hasContent}">
    <header>
      <Status :status="stage.status"/>
      <span :title="stage.name">{{ stage.name }}</span>
      <time-elapsed v-if="stage.started" :started="stage.started" :stopped="stage.stopped">
        <Hint position="top" align="right" showOn="hover">Full stage duration</Hint>
      </time-elapsed>
      <IconArrowDropdown v-if="hasSteps" direction="down" class="arrow-dropdown"/>
    </header>

    <div class="content">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import IconArrowDropdown from "./icons/IconArrowDropdown.vue";
import Hint from "./Hint";

export default {
  name: "Stage",
  props: {
    stage: { type: Object, required: true }
  },
  components: {
    Hint,
    Status,
    TimeElapsed,
    IconArrowDropdown
  },
  computed: {
    hasSteps() {
      return this.stage.steps && this.stage.steps.length;
    },
    hasContent() {
      return !!this.$slots.default;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.stage {
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;
  @include themed {
    background: tget("surface-color");
    box-shadow: 0 2px 4px 0 rgba(tget("color-text"), 0.1);
    border: 1px solid rgba(tget("color-text"), 0.1);
  }
  @include themed-only(default) {
    box-shadow: 0 2px 4px 0 rgba(tget("color-text"), 0.1);
  }
  @include themed-only(dark) {
    box-shadow: 0 2px 4px 0 darken(tget("body-color"), 20%);
  }

  &.has-content header {
    @include themed {
      border-bottom: solid 1px rgba(tget("color-text"), 0.1);
    }
  }
}

header {
  align-items: center;
  display: flex;
  height: 40px;
  padding: 0 15px;
  user-select: none;
  @include themed {
    color: tget("color-text");
  }
}

.status {
  flex-shrink: 0;
}

span {
  flex-grow: 1;
  font-weight: 600;
  margin-left: 10px;
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-elapsed {
  font-size: 13px;
  font-weight: 400;
  flex-shrink: 0;
  position: relative;
  @include themed {
    color: tget("color-text");
  }

  .hint {
    white-space: nowrap;
  }
}

.arrow-dropdown {
  display: none;
  @include themed {
    color: tget("color-text-secondary");
  }
}

.content {
  > *:first-child {
    margin-top: 10px;
  }

  > *:last-child {
    margin-bottom: 10px;
  }
}
</style>

<style lang="scss">
@import "../assets/styles/variables";
@import "../assets/styles/mixins";

.stage > .content {
  > .step-container {
    &:first-of-type .step:after {
      top: 50%;
    }

    &:last-of-type .step:after {
      bottom: 50%;
    }

    > a {
      display: block;
      @include themed {
        color: tget("color-text");
      }

      &:hover,
      &:focus {
        @include themed {
          background: tget("step-selected-bg-color");
        }

        .status.status-running svg circle {
          @include themed {
            fill: tget("step-selected-bg-color");
          }
        }
      }
    }
  }
}
</style>

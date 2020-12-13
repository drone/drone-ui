<template>
  <section :class="{ stage: true, 'has-steps': hasSteps, 'has-content': hasContent, expanded: isExpanded}">
    <component :is="isSelected && hasContent ? 'button' : 'div'" @click="emitClick" :aria-label="stageButtonLabel">
      <header>
        <Status :status="stage.status"/>
        <span :title="stage.name" class="stage-title">{{ stage.name }}</span>
        <time-elapsed v-if="stage.started" :started="stage.started" :stopped="stage.stopped">
          <Hint position="top" align="right" showOn="hover">Full stage duration</Hint>
        </time-elapsed>
        <IconArrowDropdown v-if="hasSteps" direction="down" class="arrow-dropdown"/>
      </header>
    </component>

    <div v-if="isSelected && hasContent" class="content">
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
    stage: { type: Object, required: true },
    isSelected: { type: Boolean, required: false, default: false },
    isExpanded: { type: Boolean, required: false, default: false }
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
    },
    stageButtonLabel() {
      if (!this.isSelected) return null

      return this.isExpanded ? "Collapse this stage" : "Expand this stage"
    }
  },
  methods: {
    emitClick() {
      this.isSelected && this.$emit("click");
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.stage {
  background: #ffffff;
  box-shadow: 0 2px 4px 0 rgba($color-text, 0.1);
  border: 1px solid rgba($color-text, 0.1);
  border-radius: 4px;
  box-sizing: border-box;
  user-select: none;

  &:hover,
  &:focus {
    &.has-steps {
      .stage-title {
        padding-right: 5px;
      }

      .time-elapsed {
        display: none;
      }

      .arrow-dropdown {
        display: inline-block;
      }
    }

    &.expanded {
      .arrow-dropdown {
        transform: rotate(180deg);
      }
    }
  }

  button {
    background: transparent;
    border: 0;
    padding: 0;
    text-align: left;
    width: 100%;

    &:hover {
      cursor: pointer;
    }

    &:hover,
    &:focus {
      outline: none;

      header {
        background-color: rgba($color-text, 0.02);
      }
    }
  }

  &.has-content.expanded header {
    border-bottom: solid 1px rgba($color-text, 0.1);
  }
}

header {
  align-items: center;
  display: flex;
  height: 40px;
  padding: 0 15px;
  user-select: none;
  color: $color-text;
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
  color: $color-text;
  position: relative;

  .hint {
    white-space: nowrap;
  }
}

.arrow-dropdown {
  display: none;
  color: $color-text-secondary;
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
      color: $color-text;

      &:hover,
      &:focus {
        background: $step-selected-bg-color;

        .status.status-running svg circle {
          fill: $step-selected-bg-color;
        }
      }
    }
  }
}
</style>

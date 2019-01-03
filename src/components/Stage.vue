<template>
  <section class="stage">
    <header>
      <Status :status="status"/>
      <span :title="name">{{ name }}</span>
      <time-elapsed :started="started" :stopped="stopped" v-if="started">
        <Hint position="top" align="right" showOn="hover">Full stage duration</Hint>
      </time-elapsed>
      <IconArrowDropdown direction="down" class="arrow-dropdown"/>
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
    name: String,
    os: String,
    arch: String,
    version: String,
    variant: String,
    status: String,
    created: Number,
    started: Number,
    stopped: Number
  },
  components: {
    Hint,
    Status,
    TimeElapsed,
    IconArrowDropdown
  },
  computed: {
    duration() {
      return "";
    }
  }
};
</script>

<style scoped lang="scss">
.stage {
  background: #FFF;
  box-shadow: 0 2px 4px 0 rgba(25, 45, 70, .05);
  border: 1px solid #edeef1;
  border-radius: 3px;
  box-sizing: border-box;
  user-select: none;
}

header {
  align-items: center;
  border-bottom: solid 1px rgba(25, 45, 70, 0.1);
  display: flex;
  height: 40px;
  padding: 0 15px;
  user-select: none;
  color: #192d46;
}

.status {
  flex-shrink: 0;
}

span {
  flex-grow: 1;
  font-weight: 600;
  margin-left: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.time-elapsed {
  font-size: 13px;
  font-weight: 400;
  flex-shrink: 0;
  color: #192d46;
  position: relative;

  .hint {
    white-space: nowrap;
  }
}

.arrow-dropdown {
  display: none;
  color: rgba(25, 45, 70, 0.6);
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
      color: #192d46;

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

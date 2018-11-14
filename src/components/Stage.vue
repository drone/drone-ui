<template>
    <section :class="{ hoverable }">
        <header>
            <Status :status="status"/>
            <span>{{ name }}</span>
            <time-elapsed :started="started" :stopped="stopped" v-if="started" />
            <IconArrowDropdown direction="down" class="arrow-dropdown"/>
        </header>
        <slot></slot>
    </section>
</template>

<script>
import Status from "./Status.vue";
import TimeElapsed from "./TimeElapsed.vue";
import IconArrowDropdown from "./icons/IconArrowDropdown.vue";

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
    stopped: Number,
    hoverable: Boolean
  },
  components: {
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

<style scoped>
section {
    background: #FFF;
    box-shadow: 0 2px 4px 0 rgba(25,45,70,.05);
    border: 1px solid #edeef1;
    border-radius: 3px;
    box-sizing: border-box;
    color: #8d97a2;
    margin: 15px 0px;
    user-select: none;
}

section > a:last-of-type :after {
   display: none;
}
section > a:first-of-type :before {
   display: none;
}

section.hoverable:hover header {
  background: rgba(25, 45, 70, 0.02);
}

section.hoverable:hover time {
  display: none;
}

section.hoverable:hover .arrow-dropdown {
  display: inline-block;
}

header {
    align-items: center;
    border-bottom: solid 1px rgba(25, 45, 70, 0.05);
    box-sizing: border-box;
    display: flex;
    height: 45px;
    padding: 0px 15px;
    user-select: none;
}

header:last-child {
    border-bottom: none;
}

span {
  flex: 1;
  height: 18px;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
  margin-left: 10px;
}

time{
  color: #192d46;
  height: 18px;
  font-size: 13px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  opacity: 0.5;
  text-align: right;
  margin-right: 0px;
}

.arrow-dropdown {
  display: none;
  color: rgba(25, 45, 70, 0.5);
}

a {
  display: block;
}

a:hover {
  background-color: #f8f8f9;
}
</style>

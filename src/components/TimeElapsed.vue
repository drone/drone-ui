<template>
  <div v-if="$slots.default" class="time-elapsed">
    <time>{{ time }}<slot/></time>
  </div>

  <time v-else>{{ time }}</time>
</template>

<script>
export default {
  name: "TimeElapsed",
  props: {
    started: { type: Number, required: true },
    stopped: Number
  },
  data: function() {
    return {
      currentTime: Date.now(),
      interval: null
    };
  },
  mounted: function() {
    this.processStoppedValue(this.stopped);
  },
  destroyed: function() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  computed: {
    time: function() {
      return (
        (this.hours ? this.addLeadingZeroIfNeeded(this.hours) + ":" : "") +
        (this.addLeadingZeroIfNeeded(this.minutes) + ":") +
        this.addLeadingZeroIfNeeded(this.seconds)
      );
    },
    lapsedSeconds: function() {
      return Math.ceil((this.currentTime - this.started * 1000) / 1000);
    },
    hours: function() {
      return Math.floor(this.lapsedSeconds / 60 / 60);
    },
    minutes: function() {
      return Math.floor((this.lapsedSeconds / 60) % 60);
    },
    seconds: function() {
      return this.lapsedSeconds % 60;
    }
  },
  methods: {
    updateCurrentTime: function() {
      this.currentTime = Date.now();
    },
    processStoppedValue(value) {
      if (this.interval) {
        clearInterval(this.interval);
      }

      if (value) {
        this.currentTime = value * 1000;
      } else {
        this.currentTime = Date.now();
        this.interval = setInterval(this.updateCurrentTime, 1000);
      }
    },
    addLeadingZeroIfNeeded(value) {
      return value > 9 ? value : `0${value}`;
    }
  },
  watch: {
    stopped(newValue) {
      this.processStoppedValue(newValue);
    }
  }
};
</script>

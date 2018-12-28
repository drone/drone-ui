<template>
  <time>{{ time }}</time>
</template>

<script>
export default {
  name: "TimeElapsed",
  props: {
    started: Number,
    stopped: Number
  },
  data: function() {
    return {
      currentTime: Date.now(),
      interval: null
    };
  },
  mounted: function() {
    this.updateCurrentTime();
    if (!this.stopped) {
      this.interval = setInterval(this.updateCurrentTime, 1000);
    }
  },
  destroyed: function() {
    clearInterval(this.interval);
  },
  computed: {
    time: function() {
      return [
        this.hours ? `${this.hours}h` : "",
        this.minutes ? `${this.minutes}m` : "",
        `${this.seconds}s`
      ].filter(x => x).join(" ");
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
      if (this.stopped) {
        this.currentTime = this.stopped * 1000;
      } else {
        this.currentTime = Date.now();
      }
    }
  }
};
</script>
<template>
  <time v-html="time"></time>
</template>

<script>
export default {
  name: "TimeElapsed",
  props: {
    started: Number,
    stopped: Number,
  },
  data: function() {
    return {
      currentTime: Date.now(),
      interval: null
    }
  },
  mounted: function() {
    this.updateCurrentTime();
    if (!this.stopped) {
      this.interval = setInterval(this.updateCurrentTime, 1000);
    }
  },
  destroyed: function() {
    clearInterval(this.interval)
  },
  computed: {
    time: function() {
      return this.hours + ':' + this.minutes + ':' + this.seconds;
    },
    milliseconds: function() {
      console.log()
      return this.currentTime - this.started * 1000;
    },
    hours: function() {
      var lapsed = this.milliseconds;
      var hrs = Math.floor((lapsed / 1000 / 60 / 60));
      return hrs >= 10 ? hrs : '0' + hrs;
    },
    minutes: function() {
      var lapsed = this.milliseconds;
      var min = Math.floor((lapsed / 1000 / 60) % 60);
      return min >= 10 ? min : '0' + min;
    },
    seconds: function() {
      var lapsed = this.milliseconds;
      var sec = Math.ceil((lapsed / 1000) % 60);
      return sec >= 10 ? sec : '0' + sec;
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
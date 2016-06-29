<template>
  <div>
    <h1>JOB {{status}}</h1>
    <template v-if="job">
      <div>{{ job.number}}</div>
      <div>{{ job.status }}</div>
      <div>{{ job.started_at }}</div>
      <div>{{ job.finished_at }}</div>
      <div>{{ job.exit_code }}</div>
      <div>{{ job.error }}</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    repo: {
      type: Object
    },
    build: {
      type: Object,
      default: function() {
        return {};
      }
    },
    job: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    // watch for the status to change to either open or close the WebSocket
    // connection depending on the state of the build.
    "job.status": function(after, before) {

      // if the build is no long running attempt to cloes the websocket.
      if (!isRunning(after) && this.ws) {
        this.ws.close();
      }

      if (!isRunning(before) && isRunning(after)) {
        this.connect();
        console.log(this)
      }
    }
  },

  attached: function() {
    if (!this.job) return;
    if (!isRunning(this.job.status)) return;
    console.log(this)
    this.connect();
  },

  detached: function() {
    if (this.ws) {
      this.ws.close();
    }
  },

  connect: function() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = createWebSocket(
      this.repo.owner,
      this.repo.name,
      this.build.number,
      this.job.number,
    );
    this.ws.onmessage = function(message) {
      let event = JSON.parse(message.data);
      console.log(event)
    }
  }

}

// returns true if the build is complete.
function isDone(status) {
  return ["success", "failure", "error"].lastIndexOf(status) != -1;
}

// returns true if the build is running or pending.
function isRunning(status) {
  return status == "running";
}

// creates a websocket to stream the build logs.
function createWebSocket(owner, name, number, job) {
  let proto = (window.location.protocol === "https:") ? "wss:" : "ws:";
  let path = ["/ws/logs", owner, name, number, job].join("/");
  return new WebSocket(proto + "//" + window.location.host + path);
}
</script>

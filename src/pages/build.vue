<template>
  <div>
    <h1>BUILD</h1>
    <router-view :repo="repo" :build="build" :job="job"></router-view>
  </div>
</template>

<script>
export default {

  computed: {
    // computes and caches the job from the build.
    job: function() {
      if (!this.build) return;
      if (!this.build.jobs) return;
      if (!this.$route.params.job) return;
      return findJob(this.build, this.$route.params.job);
    }
  },

  data () {
    return {
      build: {
        type: Object
      },
      repo: {
        type: Object
      }
    }
  },

  ready () {
    this.$on("event", function(event) {
      if (!this.build) return;
      if (this.build.number == event.build.number) {
        this.build = mergeBuild(this.build, event);
        if (event.job) {
          this.build.jobs = mergeJob(this.build, event);
        }
        return true;
      }
    }.bind(this))
  },

  route: {
    data (transition) {
      const {from, to, next, abort} = transition;
      this.$http.get(`/api/repos/${to.params.owner}/${to.params.name}/builds/${to.params.build}`).then((response) => {
        next({ build: response.json() })
      }, (response) => {
        abort({ error: response})
      })
    }
  }
}

function mergeBuild(build, event) {
  build.status = event.build.status;
  build.enqueued_at = event.build.enqueued_at;
  build.started_at = event.build.started_at;
  build.finished_at = event.build.finished_at;
  build.signed = event.build.signed;
  build.verified = event.build.verified;
  return build;
}

function mergeJob(build, event) {
  build.jobs.map(function(job) {
    if (job.number == event.job.number) {
      job.status = event.job.status;
      job.started_at = event.job.started_at;
      job.finished_at = event.job.finished_at;
      job.exit_code = event.job.exit_code;
      job.error = event.job.error;
    }
  })
  return build.jobs;
}

function findJob(build, number) {
  var result;
  build.jobs.map(function(job) {
    if (job.number == number) {
      result = job;
    }
  });
  return result;
}
</script>

<style>

</style>

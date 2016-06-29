<template>
  <div>
    <h1>MATRIX</h1>
    <div v-if="build">
      <div>{{ build.number}}</div>
      <div>{{ build.status }}</div>
      <div>{{ build.started_at }}</div>
      <div>{{ build.finished_at }}</div>
      <div>{{ build.signed }}</div>
      <div>{{ build.verified }}</div>
    </div>
    <ul v-if="build">
      <li v-for="job in build.jobs">
        <a v-link="{ name: 'buildResult', params: { owner: $route.params.owner, name: $route.params.name, build: $route.params.build, job: job.number }}">
        {{ job.number }} {{job.status}}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    build: {
      type: Object
    }
  },

  data () {
    return { }
  },
  //
  // ready () {
  //   this.$on("event", function(event) {
  //     if (!this.build) return;
  //     if (this.build.number == event.build.number) {
  //       this.build = mergeBuild(this.build, event);
  //       if (event.job) {
  //         this.build.jobs = mergeJob(this.build, event);
  //       }
  //       return true;
  //     }
  //   }.bind(this))
  // },
  //
  // route: {
  //   data (transition) {
  //     const {from, to, next, abort} = transition;
  //     this.$http.get(`/api/repos/${to.params.owner}/${to.params.name}/builds/${to.params.build}`).then((response) => {
  //       next({ build: response.json() })
  //     }, (response) => {
  //       abort({ error: response})
  //     })
  //   }
  // }
}
//
// function mergeBuild(build, event) {
//   build.status = event.build.status;
//   build.enqueued_at = event.build.enqueued_at;
//   build.started_at = event.build.started_at;
//   build.finished_at = event.build.finished_at;
//   build.signed = event.build.signed;
//   build.verified = event.build.verified;
//   return build;
// }
//
// function mergeJob(build, event) {
//   build.jobs.map(function(job) {
//     if (job.number == event.job.number) {
//       job.status = event.job.status;
//       job.started_at = event.job.started_at;
//       job.finished_at = event.job.finished_at;
//       job.exit_code = event.job.exit_code;
//       job.error = event.job.error;
//     }
//   })
//
//   return build.jobs;
// }

</script>

<style>

</style>

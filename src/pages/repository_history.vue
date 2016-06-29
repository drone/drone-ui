<template>
  <div>
    <h1>REPOSITORY HISTORY</h1>
    <div v-if="$loadingRouteData">Loading ...</div>

    <ul v-if="builds">
      <li v-for="build in builds | orderBy 'number' -1">
        <a v-link="{ name: 'build', params: { owner: $route.params.owner, name: $route.params.name, build: build.number }}">
        {{ build.number }} {{build.status}}
        </a>
      </li>
    </ul>

  </div>
</template>

<script>

export default {
  props: {
    repo: {
      type: Object
    }
  },

  data () {
    return {
      builds: []
    }
  },

  ready () {
    this.$on("event", function(event) {
      if (this.repo && this.repo.full_name == event.repo.full_name) {
        this.builds = mergeEvent(this.builds, event)
        return true;
      }
    }.bind(this))
  },

  route: {
    data (transition) {
      const {from, to, next, abort} = transition;

      this.$http.get(`/api/repos/${to.params.owner}/${to.params.name}/builds`).then((response) => {
        next({ builds: response.json() })
      }, (response) => {
        abort({ error: response})
      })
    }
  }
}

function mergeEvent(builds, event) {
  let found;
  builds.map(function(build) {
    if (build.number == event.build.number) {
      found = true;
      build.status = event.build.status;
      build.created_at  =event.build.created_at;
      build.started_at = event.build.started_at;
      build.finished_at = event.build.finished_at;
    }
  });
  if (!found) {
    builds.push(event.build)
  }
  return builds;
}
</script>

<style>

</style>

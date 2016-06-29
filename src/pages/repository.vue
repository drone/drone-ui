<template>

    <div>
      <div v-if="$loadingRouteData">Loading ...</div>
      <ul>
        <li><a v-link="{ name: 'repoHistory', params: { owner: $route.params.owner, name: $route.params.name }}">History</a></li>
        <li><a v-link="{ name: 'repoBadges', params: { owner: $route.params.owner, name: $route.params.name }}">Badges</a></li>
        <li><a v-link="{ name: 'repoSettings', params: { owner: $route.params.owner, name: $route.params.name }}">Settings</a></li>
      </ul>
      <router-view :repo="repo"></router-view>
    </div>
</template>

<script>

export default {

  data () {
    return {
      repo: null
    }
  },

  route: {
    data (transition) {
      const {from, to, next, abort} = transition;
      if (shouldRefresh(from, to)) {
          next()
          return
      }
      this.$http.get(`/api/repos/${to.params.owner}/${to.params.name}`).then((response) => {
        next({ repo: response.json() })
      }, (response) => {
        abort({ error: response})
      })
    }
  }
}

// returns true if the view requires a refresh.
function shouldRefresh(from, to) {
  return from.params != undefined
    && from.params.owner == to.params.owner
    && from.params.name == to.params.name;
}

// returns true if the build is running or pending.
function isRunning(status) {
  return ["running", "pending"].lastIndexOf(status) != -1;
}
</script>

<style>

</style>

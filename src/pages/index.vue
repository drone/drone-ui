<template>
  <mdl-layout>
    <ol slot="header" class="breadcrumb">
      <li>
        <a v-link="{ name: 'repoHistory', params: { owner: $route.params.owner, name: $route.params.name }}">
          <span>{{$route.params.owner}}</span>
          <span>/</span>
          <span>{{$route.params.name}}</span>
        </a>
      </li>
      <li v-if="$route.params.build">
        <i class="material-icons">chevron_right</i>
      </li>
      <li v-if="$route.params.build">
        <a v-link="{ name: 'build', params: { owner: $route.params.owner, name: $route.params.name, build: $route.params.build }}">
          {{$route.params.build}}
        </a>
      </li>
    </ol>
    <div slot="aside">
      <ul v-if="repos">
        <li v-for="repo in repos | orderBy 'full_name' | orderBy 'started_at' -1">
          <a v-link="{ name: 'repoHistory', params: { owner: repo.owner, name: repo.name }}">
          {{repo.full_name }} {{ repo.number }} {{repo.status}}
          </a>
        </li>
      </ul>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </mdl-layout>
</template>

<script>
export default {
  data () {
    return {
      repos: [],
      error: {}
    }
  },

  ready (transition) {
    this.$on("event", function(event) {
      this.repos = mergeEvent(this.repos, event)
      return true;
    }.bind(this));
  },

  route: {
    deactivate (transition) {
      if (this.ws && this.ws.close) {
        this.ws.close();
      }
      transition.next();
    },

    activate (transition) {
      this.ws = createWebSocket()
      this.ws.onmessage = function(message) {
        let event = JSON.parse(message.data);
        this.$dispatch("event", event);
        this.$broadcast("event", event);
        this.$emit("event", event)
      }.bind(this);
      transition.next();
    },

    data (transition) {
      const {next, abort} = transition;

      // this dataset only should get loaded when the route is first
      // initialized. if the repository list exists, exit.
      if (this.repos.length != 0) {
        next()
        return
      }

      // get the initial list of repositories
      this.$http.get(`/api/user/feed?latest=true`).then(function(response) {
        next({ repos: response.json() })

        // if (!this.$route.params.owner && this.repos && this.repos.length > 0) {
        //   this.$router.go('/'+this.repos[0].full_name)
        // }
      }.bind(this), (response) => {
        abort({ error: response })
      })
    }
  }
}

function mergeEvent(repos, event) {
  let found;
  repos.map(function(repo) {
    if (repo.full_name == event.repo.full_name) {
      found = true;
      repo.owner = event.repo.owner;
      repo.name = event.repo.name;
      repo.full_name = event.repo.full_name;
      repo.number = event.build.number;
      repo.status = event.build.status;
      repo.created_at  =event.build.created_at;
      repo.started_at = event.build.started_at;
      repo.finished_at = event.build.finished_at;
    }
  });
  if (!found) {
    repos.push({
      owner: event.repo.owner,
      name: event.repo.name,
      full_name: event.repo.full_name,
      number: event.build.number,
      status: event.build.status,
      created_at: event.build.created_at,
      started_at: event.build.started_at,
      finished_at: event.build.finished_at
    })
  }
  return repos;
}

function createWebSocket() {
  let proto = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  return new WebSocket(proto + '//' + window.location.host + '/ws/feed');
}
</script>

<style>

</style>

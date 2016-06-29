<template>
  <div>
    <mdl-dialog v-ref:dialog>
      <div>TOKEN</div>
      <div slot="actions">
        <mdl-button @click="$refs.dialog.close">Close</mdl-button>
      </div>
    </mdl-dialog>

    <mdl-layout>
      <div slot="aside">
        <mdl-button @click="$refs.dialog.open">Show Token</mdl-button>
        <mdl-button @click="$refs.dialog.open">Sync Account</mdl-button>
        <hr />
        <ul v-if="orgs">
          <li v-for="org in orgs">
            <div>{{org}}</div>
          </li>
        </ul>
      </div>

      <ol slot="header">
        <li>Account Settings<li>
      </ol>

      <div>
        <h1>USER SETTINGS</h1>
        <div v-if="$loadingRouteData">Loading ...</div>
        <div v-if="syncing">Syncing ...</div>



        <ul v-if="repos">
          <li v-for="repo in repos | orderBy 'full_name'">
            {{repo.full_name}}
          </li>
        </ul>

      </div>
    </mdl-layout>
  </div>
</template>

<script>

export default {
  data () {
    return {
      repos: [],
      orgs: [],
      syncing: false
    }
  },

  route: {
    data (transition) {
      const {next, abort} = transition;

      this.$http.get(`/api/user/repos?all=true`).then((response) => {
        let repos = response.json();
        let orgs = calculateOrgs(repos)
        next({ repos, orgs });
      }, (response) => {
        abort({ error: response})
      })
    }
  }
}

function calculateOrgs(repos) {
  let map = new Map();
  repos.map(function(repo) {
    map.set(repo.owner);
  });
  let unique = [];
  map.forEach(function(value, key) {
    unique.push(key)
  });
  return unique.sort();
}

</script>

<style>

</style>

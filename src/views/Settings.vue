<template>
  <div class="settings">
    <section v-if="repo" class="settings">
      <div>
        <span>Visibility</span>
        <select v-model="repo.visibility">
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="internal">Internal</option>
        </select>
      </div>

      <div>
        <span>Protected</span>
        <span>
          <input type="checkbox" v-model="repo.protected" />
        </span>
      </div>

      <div v-if="sysAdmin">
        <span>Trusted</span>
        <span>
          <input type="checkbox" v-model="repo.trusted" />
        </span>
      </div>

      <div v-if="sysAdmin">
        <span>Timeout</span>
        <select v-model="repo.timeout">
          <option
            v-for="timeout in timeouts"
            v-bind:key="timeout" :value="timeout">
              {{ timeout > 90
                  ? timeout / 60 + " hours"
                  : timeout + " minutes"
              }}
          </option>
        </select>
      </div>

      <div>
        <span>Configuration</span>
        <input type="text" v-model="repo.config_path" />
      </div>
    <button v-on:click="save">Save</button>
    </section>


    <!--
        The repair and chown buttons will require their own
        sections with an explanation of how they work. This
        should be similar visually to the GitHub repository
        settings page.

          <button v-on:click="repair">Repair</button>
          <button v-on:click="chown">Chown</button>
    -->

    <Secrets />
    <Cron />

    <section v-if="repo.active" class="disable">
      <button v-on:click="disable">Disable Repository</button>
      <p>You can disable your repository to stop processing builds.</p>
    </section>
  </div>
</template>

<script>
import Secrets from "./Secrets.vue";
import Cron from "./Cron.vue";

export default {
  name: "settings",
  data() {
    return {
      timeouts,
    }
  },
  components: {
    Secrets,
    Cron,
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      let repo = this.$store.state.repos[this.slug]
      return repo && {...repo};
    },
    sysAdmin() {
      return this.$store.state.user &&
        this.$store.state.user.admin;
    },
  },
  methods: {
    save: function (event) {
      const {namespace, name} = this.repo;
      this.$store.dispatch('updateRepo', {
        namespace,
        name,
        repo: this.repo,
      });
    },
    disable: function (event) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('disableRepo', {namespace, name});
    },
    enable: function (event) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('enableRepo', {namespace, name});
    },
    chown: function (event) {
      const {namespace, name} = this.repo;
      this.$store.dispatch('chownRepo', {namespace, name});
    },
    repair: function (event) {
      const {namespace, name} = this.repo;
      this.$store.dispatch('repairRepo', {namespace, name});
    },
  },
};

// enumerated list of timeout values for simplified
// and touch-friendly user experience.
const timeouts = [
  15, 30, 60, 90, 120, 180, 240, 300, 360, 420,
  480, 540, 600, 660, 720, 1080, 1440, 2880, 4320,
]
</script>

<style scoped>
section.settings {
  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  margin-bottom: 30px;
  padding: 15px;
}

section.disable {
  align-items: center;
  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  display: flex;
  margin-bottom: 30px;
  padding: 15px;
}

section.disable button {
  border: none;
  background: #FFF;
  border: 1px solid #de3a5d;
  border-radius: 3px;
  color: #de3a5d;
  cursor: pointer;
  font-size: 12px;
  padding: 10px 20px;
  text-transform: uppercase;
}

section.disable button:hover {
  color: #FFF;
  background: #de3a5d;
}

section.disable p {
  color: #98a1ab;
  font-size: 14px;
  padding: 0px 15px;
}
</style>
<template>
  <div class="settings-view">
    <section v-if="repo && isAdmin" class="settings">
      <div>
        <span>Visibility</span>
        <span>
          <select v-model="repo.visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="internal">Internal</option>
          </select>
        </span>
      </div>

      <div>
        <span>Protected</span>
        <span>
          <BaseCheckbox v-model="repo.protected"></BaseCheckbox>
        </span>
      </div>

      <div v-if="isRoot">
        <span>Trusted</span>
        <span>
          <BaseCheckbox v-model="repo.trusted"></BaseCheckbox>
        </span>
      </div>

      <div v-if="isRoot">
        <span>Timeout</span>
        <span>
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
        </span>
      </div>

      <div>
        <span>Configuration</span>
        <span>
          <input
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            v-model="repo.config_path" />
        </span>
      </div>
      <div class="actions">
        <button v-on:click="save">Save</button>
      </div>
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

    <section v-if="repo.active && isAdmin" class="disable">
      <button v-on:click="disable">Disable Repository</button>
      <p>You can disable your repository to stop processing builds.</p>
    </section>
  </div>
</template>

<script>
import Secrets from "./Secrets.vue";
import Cron from "./Cron.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";

export default {
  name: "settings",
  data() {
    return {
      timeouts,
    }
  },
  components: {
    BaseCheckbox,
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
    isRoot() {
      return this.$store.state.user &&
        this.$store.state.user.admin;
    },
    isAdmin() {
      const isAdmin = this.repo && this.repo.permissions && this.repo.permissions.admin;
      return this.isRoot || isAdmin;
    }
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


.settings > div {
  display: flex;
  height: 35px;
  margin-bottom: 10px;
}
.settings div > span {
  align-items: center;
  display: flex;
  font-size: 13px;
}
.settings > div > span:first-of-type {
  flex: 0 0 150px;
}
.settings > div > span:last-of-type {
  flex: 1
}

input[type="text"] {
      border-radius: 3px;
    border: 1px solid #e8eaed;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    font-size: 13px;
    outline: none;
    padding: 7px 10px;
    resize: none;
    width: 100%;
}

.settings .actions {
  border-top: 1px solid #EEE;
  padding: 0px;
  padding-top: 10px;
  margin: 0px;
}

.settings button {
  border: none;
  background: #0060da;
  border-radius: 3px;
  color: #FFF;
  font-size: 12px;
  padding: 10px 20px;
  text-transform: uppercase;
}
</style>

<style>
select {
  appearance: none;
  -webkit-appearance: none;
  border-radius: 3px;
  border: 1px solid #e8eaed;
  box-sizing: border-box;
  cursor: pointer;
  box-sizing: border-box;
  display: block;
  font-size: 13px;
  outline: none;
  padding: 7px 10px;
  resize: none;
  width: 100%;
  position:relative;

  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><polygon fill='#98a1ab' points='0,30 100, 30 50,90'/></svg>") no-repeat;
  background-size: 10px;
  background-position: center right 10px;
  background-repeat: no-repeat;
  background-color: #FFF;
}
</style>
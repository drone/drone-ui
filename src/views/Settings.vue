<template>
  <div class="settings-view">
    <Card contentPadding="0 15px 15px" v-if="isAdmin">
      <h2 slot="header">Main</h2>

      <div class="control-group">
        <label class="control-label">Project settings</label>
        <div class="controls">
          <BaseCheckbox v-model="repo.protected">Protected</BaseCheckbox>
          <BaseCheckbox v-model="repo.trusted" v-if="isRoot">Trusted</BaseCheckbox>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Project visibility</label>
        <div class="controls">
          <BaseRadioButtons v-model="repo.visibility"
                            name="visibility"
                            :options="{ public: 'Public', private: 'Private', internal: 'Internal'}"/>
        </div>
      </div>

      <div v-if="isRoot" class="control-group">
        <label class="control-label">Timeout</label>
        <div class="controls">
          <select v-model="repo.timeout">
            <option v-for="timeout in timeouts"
                    :key="timeout"
                    :value="timeout">
              {{ timeout > 90 ? timeout / 60 + " hours" : timeout + " minutes" }}
            </option>
          </select>
        </div>
      </div>

      <div class="control-group">
        <label class="control-label">Configuration</label>
        <div class="controls">
          <BaseInput v-model="repo.config_path"
                     autocomplete="off"
                     autocorrect="off"
                     autocapitalize="off"
                     spellcheck="false"/>
        </div>
      </div>

      <div class="actions">
        <Button theme="primary" @click.native="save">Save</Button>
      </div>
    </Card>

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
      <Button @click.native="disable" theme="danger">Disable Repository</Button>
      <p>You can disable your repository to stop processing builds.</p>
    </section>
  </div>
</template>

<script>
import Secrets from "./Secrets.vue";
import Cron from "./Cron.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseRadioButtons from "@/components/forms/BaseRadioButtons.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import Card from "@/components/Card.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "settings",
  data() {
    return {
      timeouts,
    }
  },
  components: {
    BaseCheckbox,
    BaseRadioButtons,
    BaseInput,
    Secrets,
    Cron,
    Card,
    Button
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
.card {
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  padding: 20px 0;
  align-items: center;
}

.control-group + .control-group {
  border-top: 1px solid rgba(25, 45, 70, 0.1);
}

.control-group .control-label {
  flex-basis: 150px;
  margin-right: 15px;
  color: rgba(25, 45, 70, 0.6);
}

.actions {
  border-top: 1px solid rgba(25, 45, 70, 0.1);
  padding-top: 15px;
}

/* Settings specific */
.control-group .controls .base-checkbox + .base-checkbox {
  margin-left: 48px;
}

select {
  appearance: none;
  border-radius: 3px;
  border: 1px solid #e8eaed;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  font-size: 13px;
  outline: none;
  padding: 7px 10px;
  resize: none;
  width: 100%;
  position: relative;

  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><polygon fill='#98a1ab' points='0,30 100, 30 50,90'/></svg>") no-repeat;
  background-size: 10px;
  background-position: center right 10px;
  background-repeat: no-repeat;
  background-color: #FFF;
}

.disable {
  padding: 15px;
}

.disable p {
  margin-top: 15px;
  color: rgba(25, 45, 70, 0.6);
}
</style>
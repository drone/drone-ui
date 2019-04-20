<template>
  <CardGroup class="settings-view">
    <Card contentPadding="0 15px 15px" v-if="isAdmin">
      <h2 slot="header">Main</h2>

      <div class="control-group">
        <label class="control-label">Project webhooks</label>
        <div class="controls">
          <BaseCheckbox v-model="repo.ignore_pull_requests">Disable Pull Requests</BaseCheckbox>
          <BaseCheckbox v-model="repo.ignore_forks">Disable Forks</BaseCheckbox>
        </div>
      </div>

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
          <BaseSelect v-model="repo.timeout" :options="timeoutsOptions"/>
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

      <div class="control-actions">
        <Button theme="primary" size="l" @click.native="save" :loading="saving">Save</Button>
        <div class="error-message" v-if="error">{{ error.message }}</div>
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
    <CronJobs />
    <Badges />

    <div v-if="repo.active && isAdmin" class="disable">
      <ButtonConfirm @click="disable"
                     theme="danger"
                     size="l"
                     :message="`Are you sure to disable repository ${repo.slug}`">
        Disable Repository
      </ButtonConfirm>
      <span>to stop processing builds.</span>
    </div>
  </CardGroup>
</template>

<script>
import Secrets from "../components/editable-list/Secrets.vue";
import CronJobs from "../components/editable-list/CronJobs.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseRadioButtons from "@/components/forms/BaseRadioButtons.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import Button from "@/components/buttons/Button.vue";
import ButtonConfirm from "@/components/buttons/ButtonConfirm.vue";
import Badges from "@/components/Badges.vue";

export default {
  name: "settings",
  data() {
    return {
      timeouts,
      error: null,
      saving: false
    };
  },
  components: {
    BaseCheckbox,
    BaseRadioButtons,
    BaseInput,
    BaseSelect,
    Secrets,
    CronJobs,
    Card,
    CardGroup,
    Badges,
    ButtonConfirm,
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
      return this.$store.state.user.data.admin;
    },
    isAdmin() {
      const isAdmin = this.repo && this.repo.permissions && this.repo.permissions.admin;
      return this.isRoot || isAdmin;
    },
    timeoutsOptions() {
      return timeouts.map(timeout => [timeout, timeout > 90 ? timeout / 60 + " hours" : timeout + " minutes"])
    }
  },
  methods: {
    save() {
      const { repo: { namespace, name }, repo } = this;
      const updatedRepo = { ...repo, timeout: parseInt(repo.timeout) };
      this.saving = true;

      this.$store
        .dispatch("updateRepo", { namespace, name, repo: updatedRepo })
        .then(() => {
          this.$store.dispatch("showNotification", { message: "Successfully saved" });
          this.error = null;
          this.saving = false;
        })
        .catch(error => {
          this.error = error;
          this.saving = false;
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

<style scoped lang="scss">
@import "../assets/styles/mixins";
@import "../assets/styles/mixins";

.control-group .controls .base-checkbox + .base-checkbox {
  margin-left: 48px;
  @include tablet {
    margin-left: 0px;
    margin-top: 10px;
    display: block;
  }
}


.disable {
  padding: 0 15px;

  @include mobile {
    text-align: center;
  }
}

.disable span {
  margin: 15px 0 0 15px;
  color: $color-text-secondary;

  @include mobile {
    display: block;
    margin: 10px 0 0 0;
  }
}
</style>

<template>
  <Card contentPadding="0 15px" class="secrets">
    <h2 slot="header">Secrets</h2>

    <div v-if="secrets.length === 0" class="alert">
      Your Secret List is Empty.
    </div>

    <EditableListItem v-for="secret in secrets"
                      class="secret"
                      :key="secret.id"
                      :name="secret.name"
                      :tags="secret.pull_request ? ['Pull Requests Enabled'] : undefined"
                      :deleting="deleting[secret.id]"
                      @delete="handleDelete(secret)"/>

    <form @submit.prevent="handleSubmit" autocomplete="off" slot="footer">
      <BaseInput name="secret.name" v-model="secret.name" placeholder="Secret Name" type="text"/>
      <BaseTextArea name="secret.data" v-model="secret.data" placeholder="Secret Value"/>
      <BaseCheckbox v-model="secret.pullRequest" style="margin-bottom: 12px;">Allow Pull Requests</BaseCheckbox>

      <div class="control-actions">
        <Button type="submit" theme="primary" size="l" :loading="creating">Add a Secret</Button>
        <div class="error-message" v-if="error">{{ error.message }}</div>
      </div>
    </form>
  </Card>
</template>

<script>
import Card from "@/components/Card.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextArea from "@/components/forms/BaseTextArea.vue";
import Button from "@/components/buttons/Button.vue";
import EditableListItem from "@/components/editable-list/EditableListItem";

export default {
  name: "secrets",
  components: {
    EditableListItem,
    BaseCheckbox,
    BaseInput,
    BaseTextArea,
    Button,
    Card
  },
  data() {
    return {
      error: null,
      creating: false,
      deleting: {},
      secret: {
        name: "",
        data: "",
        pullRequest: false
      }
    };
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    secrets() {
      const secrets = this.$store.state.secrets[this.slug];
      return secrets ? Object.values(secrets) : [];
    }
  },
  methods: {
    handleDelete: function(secret) {
      const { namespace, name } = this.$route.params;

      this.$set(this.deleting, secret.id, true);
      this.$store
        .dispatch("deleteSecret", { namespace, name, secret })
        .then(() => {
          this.$store.dispatch("showNotification", { message: "Successfully deleted" });
          this.$delete(this.deleting, secret.id);
          this.error = null;
        })
        .catch(error => {
          this.error = error;
          this.$delete(this.deleting, secret.id);
        });
    },
    handleSubmit() {
      const { namespace, name } = this.$route.params;
      const secret = {
        name: this.secret.name,
        data: this.secret.data,
        pull_request: this.secret.pullRequest
      };

      this.creating = true;
      this.$store
        .dispatch("createSecret", { namespace, name, secret })
        .then(() => {
          this.$store.dispatch("showNotification", { message: "Successfully saved" });
          this.creating = false;
          this.secret = { name: "", data: "", pullRequest: false };
          this.error = null;
        })
        .catch(error => {
          this.error = error;
          this.creating = false;
        });
    }
  }
};
</script>

<style scoped>
.alert {
  color: rgba(25, 45, 70, 0.6);
  padding: 45px 0;
  text-align: center;
}

form input[type="text"],
form textarea {
  display: block;
  margin-bottom: 15px;
  width: 100%;
  border-color: rgba(25, 45, 70, 0.15);
}

.secret + .secret {
  border-top: 1px solid rgba(25, 45, 70, 0.05);
}

form textarea {
  height: 60px;
}
</style>

<style>
.secrets .base-checkbox label:before {
  border-color: rgba(25, 45, 70, 0.15);
}
</style>

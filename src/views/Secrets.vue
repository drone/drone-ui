<template>
  <Card contentPadding="0 15px">
    <h2 slot="header">Secrets</h2>

    <div v-if="secrets.length === 0" class="alert">
      Your Secret List is Empty.
    </div>

    <Secret v-for="secret in secrets"
            :key="secret.id"
            :name="secret.name"
            :pullRequest="secret.pull_request"
            @delete="handleDelete"
            class="secret"/>

    <form @submit.prevent="handleSubmit" autocomplete="off" slot="footer">
      <BaseInput name="secret.name" v-model="secret.name" placeholder="Secret Name" type="text"/>
      <BaseTextArea name="secret.data" v-model="secret.data" placeholder="Secret Value"/>
      <BaseCheckbox v-model="secret.pullRequest" style="margin-bottom: 12px;">Allow Pull Requests</BaseCheckbox>

      <div class="actions">
        <Button type="submit" theme="primary">Add a Secret</Button>
      </div>
    </form>
  </Card>
</template>

<script>
import Card from "@/components/Card.vue";
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextArea from "@/components/forms/BaseTextArea.vue";
import Secret from "@/components/cards/Secret.vue";
import Button from "@/components/buttons/Button.vue";

export default {
  name: "secrets",
  components: {
    BaseCheckbox,
    BaseInput,
    BaseTextArea,
    Button,
    Secret,
    Card
  },
  data() {
    return {
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
      return Object.values(secrets || {});
    }
  },
  methods: {
    handleDelete: function(secret) {
      const { namespace, name } = this.$route.params;
      this.$store.dispatch("deleteSecret", { namespace, name, secret });
    },
    handleSubmit: function(event) {
      const { namespace, name } = this.$route.params;
      const secret = {
        name: this.secret.name,
        data: this.secret.data,
        pull_request: this.secret.pullRequest
      };
      this.$store.dispatch("createSecret", { namespace, name, secret });
      this.secret = {
        name: "",
        data: "",
        pullRequest: false
      };
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
}

.secret + .secret {
  border-top: 1px solid rgba(25, 45, 70, 0.1);
}

form textarea {
  height: 60px;
}
</style>

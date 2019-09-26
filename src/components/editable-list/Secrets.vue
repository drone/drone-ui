<template>
  <EditableList title="Secrets"
                itemCreateButtonTitle="add a secret"
                :items="items"
                :dispatchCreate="dispatchCreate"
                :dispatchDelete="dispatchDelete">
    <IconSecretsEmpty slot="empty"/>

    <Help slot="help" title="Secrets" href="https://docs.drone.io/configure/secrets/">
      To be used in pipeline steps
    </Help>

    <EditableListItem slot="item" slot-scope="slotProps" :tags="tags(slotProps.item)"
                      :name="slotProps.item.name"
                      :deleting="slotProps.deleting"
                      @delete="slotProps.onDelete"/>

    <template slot="fields">
      <BaseInput name="secret.name" v-model="secret.name" placeholder="Secret Name" type="text"/>
      <BaseTextArea name="secret.data" v-model="secret.data" placeholder="Secret Value"/>
      <BaseCheckbox v-model="secret.pullRequest" style="margin-bottom: 12px;">Allow Pull Requests</BaseCheckbox>
    </template>
  </EditableList>
</template>

<script>
import BaseCheckbox from "@/components/forms/BaseCheckbox.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import BaseTextArea from "@/components/forms/BaseTextArea.vue";
import Button from "@/components/buttons/Button.vue";
import EditableListItem from "@/components/editable-list/EditableListItem";
import EditableList from "@/components/editable-list/EditableList";
import IconSecretsEmpty from "@/components/icons/IconSecretsEmpty";
import Help from "@/components/Help";

export default {
  name: "secrets",
  components: {
    EditableListItem,
    EditableList,
    BaseCheckbox,
    BaseInput,
    BaseTextArea,
    Button,
    IconSecretsEmpty,
    Help
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
    items() {
      const secrets = this.$store.state.secrets[this.slug];
      return secrets ? Object.values(secrets) : [];
    }
  },
  methods: {
    dispatchCreate() {
      const { namespace, name } = this.$route.params;
      const secret = {
        name: this.secret.name,
        data: this.secret.data,
        pull_request: this.secret.pullRequest
      };

      return this.$store.dispatch("createSecret", { namespace, name, secret }).then(() => {
        this.secret = { name: "", data: "", pullRequest: false };
      });
    },

    tags(item) {
      return item.pull_request ? ["pull request"] : [];
    },

    dispatchDelete(item) {
      const { namespace, name } = this.$route.params;
      return this.$store.dispatch("deleteSecret", { namespace, name, secret: item });
    }
  }
};
</script>

<style scoped>
.icon-secrets-empty {
  display: block;
  margin: 0 auto 20px;
}
</style>

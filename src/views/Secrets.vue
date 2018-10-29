<template>
  <div class="secrets">
    <span v-for="secret in secrets" :key="secret.id">
      <Secret
        :name="secret.name"
        :expr="secret.pull_request"
        :branch="secret.pull_request_push"
        v-on:delete="handleDelete"
      />
    </span>
  
    <form @submit.prevent="handleSubmit">
      <input name="secret.name" v-model="secret.name" type="text" />
      <input name="secret.data" v-model="secret.data" type="password" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import Secret from "@/components/cards/Secret.vue";

export default {
  name: "secrets",
  components: {
    Secret,
  },
  data() {
    return {
      secret: {
        name: "",
        data: "",
      }
    }
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    secrets() {
      return this.$store.state.secrets[this.slug];
    },
  },
  methods: {
    handleDelete: function (secret) {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('deleteSecret', { namespace, name, secret });
    },
    handleSubmit: function (event) {
      const {namespace, name} = this.$route.params;
      const secret = {
        name: this.secret.name,
        data: this.secret.data,
      };
      this.$store.dispatch('createSecret', { namespace, name, secret });
      this.secret = {
        name: "",
        data: "",
      }
    }
  }
};
</script>

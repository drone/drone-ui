<template>
  <div class="settings">
    <div v-if="repo">
      <div>Visibility: {{ repo.visibility }}</div>
      <div>Trusted: {{ repo.trusted }}</div>
      <div>Timeout: {{ repo.timeout }}</div>
      <div>Protected: {{ repo.protected }}</div>
    </div>

    <button>Repair</button>
    <button>Chown</button>
  </div>
</template>

<script>
export default {
  name: "settings",
  components: {},
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.namespace];
    },
  },
  methods: {}
};
</script>

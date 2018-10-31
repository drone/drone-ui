<template>
  <div class="account">
    <header>
      <h1>User Settings</h1>
    </header>

    <section v-if="user && user.token">
      <header>
        <h2>Token</h2>
      </header>
      <div>
        <h3>Your Personal Token</h3>
        <pre>{{ user.token }}</pre>

        <h3>Example API Usage:</h3>
        <pre>curl -i {{ instance }}/api/user \
  -H "Authorization: Bearer {{ user.token }}"</pre>

        <h3>Example CLI Usage:</h3>
        <pre>export DRONE_SERVER={{ instance }}
export DRONE_TOKEN={{user.token}}

drone info</pre>

      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: "account",
  components: {},
  computed: {
    instance() {
      const {host, protocol} = this.$store.state.instance;
      return `${protocol}//${host}`
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style scoped>
.account > header {
  margin-bottom: 30px;
}

h1 {
  font-size: 22px;
}

section {
  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  margin-bottom: 30px;
}

section > div {
  padding: 15px;
}

section header {
  padding: 15px;
  border-bottom: 1px solid #e8eaed;
}

section h2 {
  font-size: 15px;
  font-weight: 600;
}

section footer {
  padding: 15px;
}

section h3 {
  background: #f8f8f9;
  border-bottom: 1px solid #ecedf0;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  color: #182c47;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  padding: 15px;
}

section pre {
  background: #f8f8f9;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  color: #506074;
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 30px;
  padding: 15px;
}

section pre:last-of-type {
  margin-bottom: 0px;
}

</style>
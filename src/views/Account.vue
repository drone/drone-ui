<template>
  <div class="account">
    <header>
      <h1>User Settings</h1>
    </header>

    <Loading v-if="showLoading"/>
    <AlertError v-else-if="error" :error="error"/>
    <CardGroup v-else-if="user && user.token">
      <Card>
        <h2 slot="header">Token</h2>

        <CodeSnippetGroup>
          <CodeSnippet>
            <h3 slot="header">Your Personal Token:</h3>
            <code>{{ user.token }}</code>
          </CodeSnippet>

          <CodeSnippet lang="terminal">
            <h3 slot="header">Example API Usage:</h3>
            <code>curl -i {{ instance }}/api/user \</code>
            <code class="out">-H "Authorization: Bearer {{ user.token }}"</code>
          </CodeSnippet>

          <CodeSnippet lang="terminal">
            <h3 slot="header">Example CLI Usage:</h3>
            <code>export DRONE_SERVER={{ instance }}</code>
            <code>export DRONE_TOKEN={{user.token}}</code>
            <code>drone info</code>
          </CodeSnippet>
        </CodeSnippetGroup>
      </Card>
    </CardGroup>

  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import CardGroup from "@/components/CardGroup.vue";
import CodeSnippet from "@/components/CodeSnippet.vue";
import CodeSnippetGroup from "@/components/CodeSnippetGroup.vue";
import Loading from "@/components/Loading.vue";
import AlertError from "@/components/AlertError.vue";

export default {
  name: "Account",
  components: {
    Card,
    CardGroup,
    CodeSnippet,
    CodeSnippetGroup,
    Loading,
    AlertError
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    instance() {
      return this.$store.state.instance.url;
    },
    user() {
      return this.$store.state.user.data;
    },
    showLoading() {
      const { user } = this.$store.state;
      return user.tokenLoading && !this.user.token;
    }
  },
  mounted() {
    this.$store.dispatch("fetchViewerToken").catch(e => {
      this.error = e;
    });
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

h1 {
  height: 41px;
  font-size: 30px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: $color-text;
  margin: 30px 0px;
}

code {
  white-space: normal;
}
</style>

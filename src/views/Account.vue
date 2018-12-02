<template>
  <div class="account">
    <header>
      <h1>User Settings</h1>
    </header>

    <CardGroup v-if="user && user.token">
      <Card>
        <header slot="header">
          <h2>Token</h2>
        </header>

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

export default {
  name: "account",
  components: {
    Card,
    CardGroup,
    CodeSnippet,
    CodeSnippetGroup,
  },
  computed: {
    instance() {
      return this.$store.state.instance.url;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style scoped>
h1 {
  height: 41px;
  font-size: 30px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
  margin: 30px 0px;
}
</style>
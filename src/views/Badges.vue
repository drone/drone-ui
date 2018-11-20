<template>
  <div class="badges">
    <CardGroup>
      <Card>
        <div slot="header" class="header">
          <h2>Badges</h2>
          <img :src="image" />
        </div>

        <CodeSnippetGroup>
          <CodeSnippet>
            <h3 slot="header">Markdown Badge:</h3>
            <pre>
              <code>{{ markdown }}</code>  
            </pre>
          </CodeSnippet>

          <CodeSnippet>
            <h3 slot="header">Markup Badge:</h3>
            <pre>
              <code>{{markup}}</code>
            </pre>
          </CodeSnippet>

          <CodeSnippet>
            <h3 slot="header">CC Menu:</h3>
            <pre>
              <code>{{ ccmenu }}</code>
            </pre>
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
  name: "badges",
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
    name() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    image() {
        return `${this.instance}/api/badges/${this.name}/status.svg`;
    },
    markdown() {
        return `[![Build Status](${this.image})](${this.instance}/${this.name})`
    },
    markup() {
        return `<a href="${this.instance}/${this.name}"><img src="${this.image}" /></a>`
    },
    ccmenu() {
        return `${this.instance}/api/badges/${this.name}/cc.xml`
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}

.header h2 {
  flex-grow: 1;
}
</style>
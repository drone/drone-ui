<template>
  <div class="build-config-page">
    <portal to="repo-nav">
      <BuildNav :slug="slug" :buildNumber="$route.params.build"/>
    </portal>

    <Card>
      <CodeSnippet>
        <h2 slot="header">.drone.yml</h2>
        <code class="yaml">{{ droneYmlContent }}</code>
      </CodeSnippet>
    </Card>
  </div>
</template>

<script>
import BuildNav from "@/components/navs/BuildNav";
import CodeSnippet from "@/components/CodeSnippet";
import Card from "@/components/Card";

export default {
  name: "BuildConfig",
  components: {
    Card,
    CodeSnippet,
    BuildNav
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    droneYmlContent() {
      // todo real data
      return `# NOW DATA IS FAKED!
kind: pipeline
name: стадия1
group: first

steps:
- name: build
  image: node
  commands:
  - npm install
  - npm test

---

kind: pipeline
name: стадия2
group: second

steps:
- name: step1
  image: node
  commands:
  - npm install
  - npm test`;
    }
  }
};
</script>

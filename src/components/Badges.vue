<template>
  <Card>
    <h2 slot="header">Badges</h2>
    <img slot="header" :src="status" alt="badge"/>
    <img slot="header" :src="coverage" alt="badge"/>

    <div class="options">
      <BaseSelect v-model="lang" :options="langs"/>
      <BaseInput v-model="branch" placeholder="master" type="text"/>
    </div>

    <CodeSnippet>
      <code>{{ codeStatus }}</code>
      <code>{{ codeCoverage }}</code>
    </CodeSnippet>
  </Card>
</template>

<script>
import Card from "@/components/Card.vue";
import CodeSnippet from "@/components/CodeSnippet.vue";
import BaseSelect from "@/components/forms/BaseSelect.vue";
import BaseInput from "@/components/forms/BaseInput.vue";

export default {
  name: "badges",
  components: {
    Card,
    CodeSnippet,
    BaseSelect,
    BaseInput
  },
  data() {
    return {
      langs,
      lang: "markdown",
      branch: undefined
    };
  },
  computed: {
    instance() {
      return this.$store.state.instance.url;
    },
    name() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    status() {
      const branchSuffix = this.branch ? `?ref=refs/heads/${this.branch}` : "";
      return `${this.instance}/api/badges/${this.name}/status.svg${branchSuffix}`;
    },
    coverage() {
      const branchSuffix = this.branch ? `?ref=refs/heads/${this.branch}` : "";
      return `${this.instance}/api/badges/${this.name}/coverage.svg${branchSuffix}`;
    },
    codeStatus() {
      switch (this.lang) {
        case "markdown":
          return `[![Build Status](${this.status})](${this.instance}/${this.name})`;
        case "markup":
          return `<a href="${this.instance}/${this.name}"><img src="${this.status}" /></a>`;
        case "ccmenu":
          return `${this.instance}/api/badges/${this.name}/cc.xml`;
      }
    },
    codeCoverage() {
      switch (this.lang) {
        case "markdown":
          return `[![Coverage](${this.coverage})](${this.instance}/${this.name})`;
        case "markup":
          return `<a href="${this.instance}/${this.name}"><img src="${this.coverage}" /></a>`;
        case "ccmenu":
          return ``;
      }
    }
  }
};

const langs = [["markdown", "Markdown"], ["markup", "Markup"], ["ccmenu", "CCMenu"]];
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.header {
  display: flex;
  align-items: center;
}

h2 {
  flex-grow: 1;
}

.options {
  display: flex;
  margin-bottom: 20px;

  @include tablet {
    flex-direction: column;
  }
}

.options select {
  flex-basis: 220px;
  margin-right: 20px;

  @include tablet {
    width: 100%;
    flex-basis: auto;
    margin-bottom: 15px;
  }
}

.options input {
  flex-grow: 1;

  @include tablet {
    width: 100%;
  }
}
</style>

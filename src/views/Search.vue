<template>
  <div class="page-search">
    <BaseForm class="form">
      <BaseInput ref="input" type="search" placeholder="Search repositories or jump to …" v-model="query"/>
    </BaseForm>

    <RepoList v-if="queryTrimmed" :items="results" emptyMessage="Repositories not found."/>
  </div>
</template>

<script>
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseInput from "@/components/forms/BaseInput.vue";
import RepoList from "@/components/RepoList.vue";

import reposSort from "@/lib/reposSort";
import reposSearch from "@/lib/reposSearch";

export default {
  name: "Search",
  components: {
    BaseForm,
    BaseInput,
    RepoList
  },
  data() {
    return {
      query: ""
    };
  },
  computed: {
    results() {
      const repos = Object.values(this.$store.state.latest);
      return reposSort(reposSearch(repos, this.queryTrimmed));
    },
    queryTrimmed() {
      return this.query.trim();
    }
  },
  mounted() {
    this.$refs.input.$el.focus();
  },
  methods: {
    onInput() {
      this.loadIfNeeded();
    },
    loadIfNeeded() {
      if (this.$store.state.latestStatus === "empty") {
        this.$store.dispatch("fetchReposLatest");
      }
    }
  }
};
</script>

<style scoped>
.form {
  margin: 15px 0;
}

.form input {
  width: 100%;
}
</style>

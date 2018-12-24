<template>
  <div class="page-builds-feed">
    <PageHeader>
      <span class="title">Recent builds</span>
      <slot name="header"></slot>
    </PageHeader>

    <RepoList :items="$store.state.buildsFeed.data" emptyMessage="No recent builds." :repoToProps="repoToProps"/>
  </div>
</template>

<script>
import RepoList from "@/components/RepoList.vue";
import PageHeader from "@/components/PageHeader.vue";

export default {
  name: "BuildsFeed",
  components: {
    RepoList,
    PageHeader
  },
  methods: {
    repoToProps(repo) {
      return {
        ...RepoList.defaultRepoToProps(repo),
        build: { ...repo.build, started: null, created: null },
        class: "media-mobile"
      };
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 18px;
}
</style>

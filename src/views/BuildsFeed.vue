<template>
  <div class="page-builds-feed">
    <RepoList :items="$store.state.buildsFeed.data" emptyMessage="No recent builds."/>
  </div>
</template>

<script>
import RepoList from "@/components/RepoList.vue";

export default {
  name: "BuildsFeed",
  components: {
    RepoList
  }
};
</script>

<style scoped>
.page-builds-feed {
  margin-top: 15px;
}
</style>

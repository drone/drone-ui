<template>
  <div class="repo-list">
    <Alert v-if="!loading && !items.length && emptyMessage">{{emptyMessage}}</Alert>

    <Loading v-if="loading">{{emptyMessage}}</Loading>

    <div v-if="!loading" class="list-item" v-for="repo in items" :key="`${repo.id}.${repo.build && repo.build.id}`">
      <RepoLink :repo="repo">
        <RepoItem v-bind='repoToProps(repo)'/>
      </RepoLink>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoLink from "@/components/RepoLink.vue";
import RepoItem from "@/components/RepoItem.vue";
import Loading from "@/components/Loading.vue";

function defaultRepoToProps(repo) {
  return {
    active: repo.active,
    title: `${repo.namespace}/${repo.name}`,
    build: repo.build,
    status: repo.build && repo.build.status,
    avatar: repo.build && repo.build.author_avatar
  };
}

export default {
  name: "RepoList",
  defaultRepoToProps,
  props: {
    items: Array,
    loading: Boolean,
    emptyMessage: String,
    repoToProps: { type: Function, default: defaultRepoToProps }
  },
  components: {
    Alert,
    RepoLink,
    RepoItem,
    Loading
  }
};
</script>

<style scoped>
.list-item + .list-item {
  margin-top: 10px;
}
</style>

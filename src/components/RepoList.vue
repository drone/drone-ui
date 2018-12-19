<template>
  <div class="repo-list">
    <Alert v-if="!loading && !items.length && emptyMessage">{{emptyMessage}}</Alert>

    <Loading v-if="loading">{{emptyMessage}}</Loading>

    <div v-if="!loading" class="list-item" v-for="repo in items" :key="repo.id">
      <RepoLink :repo="repo">
        <RepoItem :active="repo.active"
                  :title="`${repo.namespace}/${repo.name}`"
                  :build="repo.build"
                  :status="repo.build && repo.build.status"
                  :avatar="repo.build && repo.build.author_avatar"/>
      </RepoLink>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoLink from "@/components/RepoLink.vue";
import RepoItem from "@/components/RepoItem.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "RepoList",
  props: {
    items: Array,
    loading: Boolean,
    emptyMessage: String
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

<template>
  <div class="repo-list">
    <Alert v-if="!loading && !items.length && emptyMessage">{{emptyMessage}}</Alert>

    <Loading v-if="loading">{{emptyMessage}}</Loading>

    <div v-if="!loading" class="list-item" v-for="repo in items" :key="repo.id">
      <RepoLink :repo="repo">
        <ShortRepoItem v-if="!repo.build"
                       :namespace="repo.namespace"
                       :name="repo.name"
                       :active="repo.active"/>

        <RepoItem v-if="repo.build"
                  :title="`${repo.namespace}/${repo.name}`"
                  :build="repo.build"
                  :status="repo.build.status"
                  :avatar="repo.build.author_avatar"/>
      </RepoLink>
    </div>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoLink from "@/components/RepoLink.vue";
import RepoItem from "@/components/RepoItem.vue";
import ShortRepoItem from "@/components/ShortRepoItem.vue";
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
    ShortRepoItem,
    Loading
  }
};
</script>

<style scoped>
.list-item + .list-item {
  margin-top: 10px;
}
</style>

<template>
  <div class="page-builds-feed">
    <PageHeader>
      <span>Builds feed</span>
      <slot name="header"></slot>
    </PageHeader>

    <RepoList
      :items="$store.state.buildsFeed.data"
      emptyMessage="No recent builds."
      :repoItemProps="{ class: 'media-mobile '}"/>
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
  }
};
</script>

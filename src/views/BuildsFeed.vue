<template>
  <div class="page-builds-feed" :class="{ 'page-builds-feed_empty': isEmpty }">
    <PageHeader>
      <span class="title">Recent builds</span>
      <slot name="header"></slot>
    </PageHeader>

    <RepoList :items="items" :repoToProps="repoToProps">
      <NoRecentBuilds slot="emptyMessage"/>
    </RepoList>
  </div>
</template>

<script>
import RepoList from "@/components/RepoList.vue";
import PageHeader from "@/components/PageHeader.vue";
import NoRecentBuilds from "@/components/NoRecentBuilds.vue";

export default {
  name: "BuildsFeed",
  components: {
    RepoList,
    PageHeader,
    NoRecentBuilds
  },
  computed: {
    isEmpty() {
      return !this.items.length;
    },
    items() {
      return this.$store.state.buildsFeed.data;
    }
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

<style lang="scss">
.page-builds-feed_empty {
  height: 100%;
  position: relative;

  & > .page-header {
    position: relative;
    z-index: 2;
  }

  & > .repo-list {
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

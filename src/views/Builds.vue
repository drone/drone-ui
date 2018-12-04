<template>
  <div class="builds">
    <Alert v-if="loaded && builds.length === 0">
      Your Build List is Empty.
    </Alert>

    <router-link
      class="build"
      v-for="build in builds"
      :key="build.id"
      :to="'/'+slug + '/' + build.number">
      <RepoItem metaAlign="left"
                :number="build.number"
                :title="build.message"
                :status="build.status"
                :build="shrinkBuild(build)"
                :avatar="build.author_avatar"/>
    </router-link>

    <Loading v-show="loading"/>
    <MoreButton v-if="hasMore" @click.native="showMore">Show more</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoItem from "@/components/RepoItem.vue";
import Loading from "@/components/Loading.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";

export default {
  name: "builds",
  components: {
    Alert,
    RepoItem,
    Loading,
    MoreButton
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    collection() {
      return this.$store.state.builds[this.slug];
    },
    builds() {
      const values = this.collection ? Object.values(this.collection.data) : [];
      values.sort((a, b) => b.number - a.number);
      return values;
    },
    loading() {
      return this.collection && this.collection.status === "loading";
    },
    loaded() {
      return this.collection && this.collection.status === "loaded";
    },
    hasMore() {
      const lastBuilds = this.builds[this.builds.length - 1];
      return !this.loading && lastBuilds && lastBuilds.number !== 1;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    }
  },
  methods: {
    showMore() {
      this.$store.dispatch('fetchBuilds', { ...this.$route.params, page: this.collection.page + 1})
    },
    shrinkBuild(build) {
      return { ...build, message: null };
    }
  }
};
</script>

<style>
.builds .build .repo-item .header .number,
.builds .build:hover .repo-item .header {
  color: #0564d7;
}
</style>

<style scoped>
.build {
  display: block;
}

.build:hover,
.build:focus {
  outline: none;
}

.build:hover .repo-item,
.build:focus .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}

.build + .build {
  margin-top: 10px;
}

.loading {
  margin: 20px 0;
  color: rgba(25, 45, 70, 0.6);
}

.more-button {
  margin-top: 20px;
}
</style>

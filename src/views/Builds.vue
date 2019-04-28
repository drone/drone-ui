<template>
  <div class="builds">
    <AlertError v-if="loadingError" :error="loadingError"/>

    <template v-else>
      <Alert v-if="showEmptyListAlert">
        <IconDroneSleep/>
        <div class="empty-message">Your Build List is Empty.</div>
      </Alert>

      <router-link
        class="build"
        v-for="build in builds"
        :key="build.id"
        :to="'/'+slug + '/' + build.number">
        <RepoItem :number="build.number"
                  :title="build.title || build.message"
                  :status="build.status"
                  :build="shrinkBuild(build)"
                  :avatar="build.author_avatar"
                  :linkRepo="repo"/>
      </router-link>

      <MoreButton v-if="showHasMore" @click.native="showMore">Show more</MoreButton>
    </template>

    <Loading v-if="showLoading" text="Loading builds"/>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoItem from "@/components/RepoItem.vue";
import Loading from "@/components/Loading.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import AlertError from "@/components/AlertError.vue";
import IconDroneSleep from "@/components/icons/IconDroneSleep";

export default {
  name: "Builds",
  components: {
    Alert,
    RepoItem,
    Loading,
    AlertError,
    MoreButton,
    IconDroneSleep
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    collection() {
      return this.$store.state.builds[this.slug];
    },
    builds() {
      if (!this.collection) return [];

      const buildCollections = Object.values(this.collection.data);
      const builds = [];

      for (let i = 0; i < buildCollections.length; ++i) {
        const data = buildCollections[i].data;
        if (data) builds.push(data);
      }

      builds.sort((a, b) => b.number - a.number);
      return builds;
    },
    showLoading() {
      return (
        this.collection &&
        this.collection.lStatus === "loading" &&
        (this.collection.dStatus === "empty" || this.collection.lPage > 1)
      );
    },
    loadingError() {
      return this.collection.lStatus === "error" ? this.collection.error : null;
    },
    showEmptyListAlert() {
      return this.collection && this.collection.dStatus === "present" && this.builds.length === 0;
    },
    showHasMore() {
      const lastBuilds = this.builds[this.builds.length - 1];
      return this.collection && this.collection.lStatus === "loaded" && lastBuilds && lastBuilds.number !== 1;
    }
  },
  methods: {
    showMore() {
      this.$store.dispatch("fetchBuilds", { ...this.$route.params, page: this.collection.page + 1 });
    },
    shrinkBuild(build) {
      return { ...build, message: null };
    }
  }
};
</script>

<style lang="scss">
@import "../assets/styles/variables";

.builds .build .repo-item .header .number,
.builds .build:hover .repo-item .header {
  color: $color-primary;
}
</style>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.icon-drone-sleep {
  margin-bottom: 20px;
}

.empty-message {
  color: $color-text-secondary;
}

.build {
  display: block;
}

.build:hover,
.build:focus {
  outline: none;
}

.build:hover .repo-item,
.build:focus .repo-item {
  box-shadow: 0 4px 10px 0 rgba($color-text, 0.25);
}

.build + .build {
  margin-top: 10px;
}

.loading {
  margin: 20px 0;
  color: $color-text-secondary;
}

.more-button {
  margin: 15px 0 0 12px;

  @include mobile {
    margin-left: 7px;
  }
}
</style>

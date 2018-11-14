<template>
  <div class="builds">
    <Alert v-if="builds && builds.length == 0">
      Your Build List is Empty.
    </Alert>

    <router-link
      class="build"
      v-for="build in limitedBuilds"
      :key="build.id"
      :to="'/'+slug + '/' + build.number">
      <RepoItem :number="build.number"
                :message="build.author_login"
                :title="build.message"
                :status="build.status"
                :build="build"
                :avatar="build.author_avatar"/>
    </router-link>

    <MoreButton v-if="hasMore" @click.native="showMore">Show more</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import RepoItem from "@/components/RepoItem.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";

export default {
  name: "builds",
  components: {
    Alert,
    RepoItem,
    MoreButton
  },
  data() {
    return {
      limit: 10
    };
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    builds() {
      let { builds } = this.$store.state;
      let values = Object.values(builds[this.slug] || {});
      values.sort((a, b) => b.number - a.number);
      return values;
    },
    limitedBuilds() {
      return this.builds.slice(0, this.limit);
    },
    hasMore() {
      return this.limitedBuilds.length < this.builds.length;
    }
  },
  methods: {
    showMore() {
      this.limit += 10;
    }
  }
};
</script>

<style>
.builds .build .repo-item .header h3 .number,
.builds .build:hover .repo-item .header h3 {
  color: #0564d7;
}
</style>

<style scoped>
.build {
  display: block;
}

.build:hover .repo-item {
  box-shadow: 0 4px 10px 0 rgba(25, 45, 70, 0.25);
}

.build + .build {
  margin-top: 10px;
}

.more-button {
  margin-top: 20px;
}
</style>

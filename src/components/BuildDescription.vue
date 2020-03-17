<template>
  <div class="build-description">
    <span>{{ build.author_login }}</span>
    <span> {{ action }} </span>
    <RepoItemLabel type="actionTarget" :build="build" :repo="linkRepo" :link="!!linkRepo"/>
    <RepoItemLabel class="to" type="to" :build="build" :repo="linkRepo" :link="!!linkRepo" prefix=" to "/>
    <span class="commit-message" v-if="build.message" :title="build.message"> — {{ build.message }}</span>
  </div>
</template>

<script>
import RepoItemLabel from "@/components/RepoItemLabel";
export default {
  name: "BuildDescription",
  props: {
    build: { Object, required: true },
    linkRepo: Object
  },
  components: {
    RepoItemLabel
  },
  computed: {
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      return "pushed";
    }
  }
};
</script>

<style scoped lang="scss">
.build-description {
  color: rgba(25, 45, 70, 0.6);
  line-height: 20px;
}
.commit-message {
  font-style: italic;
}
</style>
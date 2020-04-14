<template>
  <div class="build-description">
    <span>{{ whodunnit }}</span>
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
    whodunnit() {
      const { event, trigger, author_login } = this.build;
      if (event === "promote") return trigger;
      if (event === "rollback") return trigger;
      return author_login;
    },
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      if (event === "rollback") return "reverted";
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
<template>
  <Card class="branch-item" slim :hoverable="hoverable">
    <div class="branch">{{ branch }}</div>
    <BuildDescription :build="shrinkedBuild" :linkRepo="linkRepo"/>
    <Status :status="status"/>
  </Card>
</template>

<script>
import Status from "@/components/Status.vue";
import Card from "@/components/Card.vue";
import BuildDescription from "@/components/list-items/BuildDescription";

export default {
  name: "BranchItem",
  props: {
    hoverable: { type: Boolean, default: false },
    branch: { type: String, required: true },
    status: { type: String, required: true },
    build: { type: Object, required: true },
    linkRepo: Object
  },
  components: {
    Card,
    BuildDescription,
    Status
  },
  computed: {
    action() {
      const { event } = this.build;
      if (event === "pull_request") return "opened pull request";
      if (event === "tag") return "created tag";
      if (event === "promote") return "promoted";
      return "pushed";
    },
    shrinkedBuild() {
      return { ...this.build, target: null };
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/mixins";

.branch-item {
  display: flex;
  padding: 13px 15px;
  align-items: center;

  @include tablet {
    flex-wrap: wrap;
  }
}

.branch {
  max-width: 170px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background: $color-primary-bg;
  border-radius: 2px;
  font-weight: 600;
  color: $color-primary;
  margin-right: 15px;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @include tablet {
    margin-right: auto;
  }
}

.build-description {
  flex-grow: 1;
  margin-right: 10px;

  @include tablet {
    order: 2;
    margin-top: 10px;
    width: 100%;
    margin-right: 0;
  }
}

.status {
  flex-shrink: 0;
}
</style>

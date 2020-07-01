<template>
  <div class="deployments-page">
    <AlertError v-if="showState === 'loadingError'" :error="collection.error"/>
    <Loading v-if="showState === 'loading'" text="Loading builds"/>

    <template v-if="showState === 'data'">
      <Card v-if="items.length < 1">Your Build List is Empty.</Card>

      <router-link v-for="build in items" :key="build.id" :to="`/${slug}/${build.number}`">
        <DeploymentItem hoverable
                    :branch="build.deploy_to"
                    :status="build.status"
                    :build="build"
                    :linkRepo="repo"/>
      </router-link>
    </template>
  </div>
</template>

<script>
import Card from "@/components/Card.vue";
import DeploymentItem from "@/components/DeploymentItem.vue";
import Loading from "@/components/Loading.vue";
import AlertError from "@/components/AlertError.vue";
export default {
  name: "Deployments",
  components: {
    Card,
    DeploymentItem,
    Loading,
    AlertError
  },
  mounted() {
    // todo proper fetch action
    const { name, namespace } = this.$route.params;
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    collection() {
      // todo use proper collection;
      const collection = this.$store.state.deployments[this.slug];
      return collection ? { ...collection, data: collection.data } : null;
    },
    items() {
      // return this.collection ? Object.values(this.collection.data).map(x => x.data) : [];
      return this.collection ? Object.values(this.collection.data).map(x => x.data).sort((a, b) => b.number - a.number).slice(0, 10) : [];
    },
    showState() {
      if (!this.collection) return;
      if (this.collection.lStatus === "error") return "loadingError";
      if (this.collection.dStatus === "present") return "data";
      if (this.collection.lStatus === "loading") return "loading";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";
.deployments-page {
  a {
    display: block;
    + a {
      margin-top: 10px;
    }
  }
}
</style>
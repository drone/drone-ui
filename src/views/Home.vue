<template>
      <div>
        <Breadcrumb>
          <router-link :to="'/'">Repositories</router-link>
          <BreadcrumbDivider />
          <router-link :to="'/'">Dashboard</router-link>
        </Breadcrumb>

        <!-- Repository List (Active) -->

            <router-link
              v-for="repo in repos"
              :key="repo.id"
              :to="repo.slug">
              <InactiveRepoItem
                v-if="!repo.build"
                :namespace="repo.namespace"
                :name="repo.name" />

              <RepoItem
                v-if="repo.build"
                :namespace="repo.namespace"
                :name="repo.name"
                :number="repo.build.number"
                :event="repo.build.event"
                :status="repo.build.status"
                :message="repo.build.message"
                :commit="repo.build.after"
                :branch="repo.build.branch"
                :reference="repo.build.ref"
                :created="repo.build.created"
                :started="repo.build.started"
                :finished="repo.build.finished"
                :avatar="repo.build.author_avatar"
              />
            </router-link>
    <button v-if="!all" v-on:click="showAll">Show All Repositories</button>
  </div>
</template>

<script>
import InactiveRepoItem from "@/components/InactiveRepoItem.vue";
import RepoItem from "@/components/RepoItem.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import BreadcrumbDivider from "@/components/BreadcrumbDivider.vue";

export default {
  name: "home",
  components: {
    BreadcrumbDivider,
    Breadcrumb,
    InactiveRepoItem,
    RepoItem
  },
  data() {
    return {
      all: false,
    }
  },
  computed: {
    repos() {
      // TODO improve the sorting code here. It is currently
      // split into two separate sorting operations, but should
      // be possible to combine to a single operation.
      let list = Object.values(this.$store.state.latest || {});

      // sort by repository name, ascending.
      list.sort(function(a, b){
        if (a.slug < b.slug) return -1;
        if (a.slug > b.slug) return 1;
        return 0;
      });

      // sort by active status.
      list.sort(function(a, b){ return b.active-a.active});
      return this.all ? list : list.slice(0, 10);
    },
  },
  methods: {
    showAll: function() {
      this.all = true;
    }
  }
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  color: #8f99a4;
  cursor: pointer;
  font-size: 13px;
  padding: 0px;
}
</style>

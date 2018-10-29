<template>
      <div>
        <Breadcrumb>
          <router-link :to="'/'">Repositories</router-link>
          <BreadcrumbDivider />
          <router-link :to="'/'">Dashboard</router-link>
        </Breadcrumb>

        <!-- Repository List (Active) -->
        <div>
          <span v-for="repo in builds" :key="repo.id">
            <router-link :to="repo.slug">
              <RepoItem
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
          </span>
        </div>

        <!-- Repository List (Inactive) -->
        <div>
          <span v-for="repo in repos" :key="repo.id">
            <InactiveRepoItem v-if="!repo.active" :namespace="repo.namespace" :name="repo.name" />
          </span>
        </div>

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
  computed: {
    repos() {
      return Object.values(this.$store.state.repos || {}) 
    },
    builds() {
      return Object.values(this.$store.state.latest || {}) 
    }
  }
};
</script>

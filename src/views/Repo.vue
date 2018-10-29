<template>
  <div class="repo">
    <!--
        this section provides the breadcrumb section for
        the repository page and sub-pages. TODO evaluate
        if this should be moved to the base layout.
    -->
    <Breadcrumb>
      <router-link :to="'/'">Repositories</router-link>
      <BreadcrumbDivider />
      <router-link :to="'/'+namespace">{{ namespace }}</router-link>
      <BreadcrumbDivider v-if="$route.params.build" />
      <router-link v-if="$route.params.build" :to="'/'+namespace"># {{ $route.params.build }}</router-link>
    </Breadcrumb>

    <!--
        this section provides the repository header.
    -->
    <router-link :to="'/'+namespace">
      <h1 v-if="repo">
        {{ repo.slug }}
      </h1>
    </router-link>

    <!--
        this section provides views for alternate states,
        such as loading or error states. TODO IMPORTANT
        these are not yet wired up to the store ...
    -->
    <!-- <div class="loading" v-if="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div> -->

    <!--
         this section provides the repository navigation bar. It is
         enabled for all sub-pages with the exception of the build
         page.
    -->
    <nav v-if="$route.name != 'build'">
      <router-link :to="'/'+namespace">Activity Feed</router-link>
      <router-link :to="'/'+namespace + '/cron'">Cron</router-link>
      <router-link :to="'/'+namespace + '/secrets'">Secrets</router-link>
      <router-link :to="'/'+namespace + '/settings'">Settings</router-link>
    </nav>

    <!--
        this is the router outlet for all repository pages, including
        the build pages.
    -->
    <router-view></router-view>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
import BreadcrumbDivider from "@/components/BreadcrumbDivider.vue";

export default {
  name: "repo",
  components: {
    Breadcrumb,
    BreadcrumbDivider,
  },
  computed: {
    namespace() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.namespace];
    },
  },
  methods: {}
};
</script>

<style scoped>
h1 {
  color: #182c47;
  font-size: 25px;
  margin: 40px 0px;
}

nav a {
  color: #8d96a2;
  display: inline-block;
  font-size: 14px;
  padding-bottom: 10px;
  margin-right: 15px;
  text-transform: uppercase;
}

nav a:hover {
  color: #2d4057;
}

nav .router-link-exact-active {
  border-bottom: 1px solid #2d4057;
  color: #2d4057;
}
</style>

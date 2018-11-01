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
      <router-link :to="'/'+slug">{{ slug }}</router-link>
      <BreadcrumbDivider v-if="$route.params.build" />
      <router-link v-if="$route.params.build" :to="'/'+slug"># {{ $route.params.build }}</router-link>

<transition name="fade">
      <div class="loading" v-show="repoLoading" style="background: #EEE; color: #8d97a2; border-radius: 3px; padding: 3px 10px; display: inline-block; text-transform: uppercase;font-size: 11px;">
        Loading...
      </div>
      </transition>
    </Breadcrumb>

    <!--
        this section provides the repository header.
    -->
    <router-link :to="'/'+slug">
      <h1 v-if="repo">
        {{ repo.slug }}
      </h1>
    </router-link>

    <Alert v-if="error" style="margin-top:30px;">
      Repository Not Found.
    </Alert>

    <!--
         this section provides the repository navigation bar. It is
         enabled for all sub-pages with the exception of the build
         page.
    -->
    <nav v-if="showTabs">
      <router-link :to="'/'+slug">Activity Feed</router-link>
      <!-- <router-link :to="'/'+slug + '/cron'">Cron</router-link>
      <router-link :to="'/'+slug + '/secrets'">Secrets</router-link> -->
      <router-link :to="'/'+slug + '/settings'">Settings</router-link>
    </nav>



    <Alert v-if="repoEnablingErr && repoEnablingErr.status === 402">
      You have reached your repository activation limit.
      <small>Please contact your system administrator.</small>
    </Alert>
    <Alert v-else-if="repoEnablingErr">
      There was a problem enabling your repository.
      <small>{{ repoEnablingErr.message }}.</small>
    </Alert>
    <div class="alert activate" v-else-if="showActivatePrompt">
      <button v-on:click="handleActivate" :disabled="repoEnabling">Activate</button>
      Activate this repository 
    </div>

    <!--
        this is the router outlet for all repository pages, including
        the build pages.
    -->
    <router-view v-if="showRouterOutlet"></router-view>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import BreadcrumbDivider from "@/components/BreadcrumbDivider.vue";

export default {
  name: "repo",
  components: {
    Alert,
    Breadcrumb,
    BreadcrumbDivider,
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    repoEnabling() {
      return this.$store.state.repoEnabling;
    },
    repoEnablingErr() {
      return this.$store.state.repoEnablingErr;
    },
    repoLoading() {
      const {repoLoading} = this.$store.state;
      return repoLoading;
    },
    error() {
      const {repoLoading, repoLoaded, repoLoadingErr} = this.$store.state;
      return repoLoaded && repoLoadingErr;
    },
    showActivatePrompt() {
      return this.repo && !this.repo.active;
    },
    showRouterOutlet() {
      return this.repo && this.repo.active;
    },
    showTabs() {
      return this.$route.name != 'build' &&
        this.$route.name != 'step' &&
        (this.repo && this.repo.active);
    }
  },
  methods: {
    handleActivate: function() {
      const {namespace, name} = this.$route.params;
      this.$store.dispatch('enableRepo', {
        namespace: namespace,
        name: name,
      });
    },
  }
};
</script>

<style scoped>
h1 {
  color: #182c47;
  font-size: 25px;
  margin: 40px 0px;
}

nav {
  border-bottom: 1px solid #EEE;
  margin-bottom: 20px;
}

nav a {
  color: #8d96a2;
  display: inline-block;
  font-size: 13px;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.alert.activate {
  padding: 15px;
  background: #FFF;
  border: 1px solid #EEE;
}
.alert.activate button {
  margin-right: 10px;
  border: none;
  background: #0060da;
  border-radius: 3px;
  color: #FFF;
  cursor: pointer;
  font-size: 12px;
  padding: 7px 20px;
  text-transform: uppercase;
}
</style>

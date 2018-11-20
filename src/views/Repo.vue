<template>
  <div class="repo">
    <!--
        this section provides the breadcrumb section for
        the repository page and sub-pages. TODO evaluate
        if this should be moved to the base layout.
    -->
    <Breadcrumb>
      <router-link :to="'/'" class="link">Repositories</router-link>

      <IconArrow direction="right"/>

      <router-link v-if="$route.params.build" :to="'/'+slug" class="link">{{ slug }}</router-link>
      <span v-else>{{ slug }}</span>

      <IconArrow direction="right" v-if="$route.params.build"/>

      <span v-if="$route.params.build">#{{ $route.params.build }}</span>

      <transition name="fade">
        <div class="loading" v-show="repoLoading">Loading...</div>
      </transition>
    </Breadcrumb>

    <!--
        this section provides the repository header.
    -->
    <h1 v-if="repo">{{ repo.name }}</h1>

    <Alert v-if="error" style="margin-top:30px;">
      Repository Not Found.
    </Alert>

    <!--
         this section provides the repository navigation bar. It is
         enabled for all sub-pages with the exception of the build
         page.
    -->
    <nav v-if="showTabs">
      <router-link :to="'/'+slug" :disabled="!repo.active">Activity Feed</router-link>
      <router-link :to="'/'+slug + '/badges'" :disabled="!repo.active">Badges</router-link>
      <router-link :to="'/'+slug + '/settings'" v-if="showSettings">Settings</router-link>
    </nav>

    <Alert v-if="repoEnablingErr && repoEnablingErr.status === 402">
      You have reached your repository activation limit.
      <span slot="secondary">Please contact your system administrator.</span>
    </Alert>
    <Alert v-else-if="repoEnablingErr">
      There was a problem enabling your repository.
      <span slot="secondary">{{ repoEnablingErr.message }}.</span>
    </Alert>
    <Card v-else-if="showActivatePrompt">
      <Button theme="primary" @click.native="handleActivate" :disabled="repoEnabling">Activate</Button>
      Activate this repository
    </Card>

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
import IconArrow from "@/components/icons/IconArrow.vue";
import Link from "@/components/Link.vue";
import Button from "@/components/buttons/Button.vue";
import Card from "@/components/Card.vue";

export default {
  name: "repo",
  components: {
    Alert,
    Breadcrumb,
    IconArrow,
    Link, /* styles required */
    Button,
    Card
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
      return this.$route.name !== "build" && this.$route.name !== "step" && this.repo;
    },
    showSettings() {
      return this.repo && this.repo.permissions && this.repo.permissions.write;
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
  margin-bottom: 25px;
  padding-left: 15px;

  height: 41px;
  font-size: 30px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #192d46;
}

nav {
  border-bottom: 1px solid rgba(25, 45, 70, 0.1);
  margin-bottom: 20px;
  padding-left: 15px;
}

nav a {
  box-sizing: border-box;
  color: rgba(25, 45, 70, 0.6);
  display: inline-block;
  height: 30px;
  line-height: 29px;
  text-transform: uppercase;
  margin-bottom: -1px;
  letter-spacing: 0.5px;
  font-weight: 500;
}

nav a + a {
  margin-left: 30px;
}

nav a:hover,
nav a:focus {
  color: #192d46;
}

nav a[disabled],
nav a[disabled]:hover,
nav a[disabled]:focus {
  pointer-events: none;
  color: rgba(25, 45, 70, 0.25);
}

nav .router-link-exact-active {
  border-bottom: 1px solid #192d46;
  color: #192d46;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.alert.activate button {
  margin-right: 10px;
}

.breadcrumb svg {
  padding-top: 1px;
  margin-right: 10px;
  color: rgba(25, 45, 70, 0.6);
}

.loading {
  background: #eee;
  color: #8d97a2;
  border-radius: 3px;
  padding: 3px 10px;
  display: inline-block;
  text-transform: uppercase;
  font-size: 11px;
  margin-left: 10px;
}
</style>

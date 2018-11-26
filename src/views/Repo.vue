<template>
  <div class="repo">
    <!--
        this section provides the breadcrumb section for
        the repository page and sub-pages. TODO evaluate
        if this should be moved to the base layout.
    -->
    <PageHeader>
      <Breadcrumb>
        <router-link :to="'/'" class="link">Repositories</router-link>

        <router-link v-if="$route.params.build" :to="'/'+slug" class="link repo-name-breadcrumb" :title="slug">{{ slug }}</router-link>
        <span :title="slug" v-else>{{ slug }}</span>

        <span v-if="$route.params.build">#{{ $route.params.build }}</span>
      </Breadcrumb>
    </PageHeader>

    <PageHeader class="secondary-page-header">
      <h1 v-if="repo">{{ repo.name }}</h1>

      <div v-if="build">
        <Button outline
                @click.native="handleCancel"
                v-if="!build.finished"
                :disabled="!isCollaborator"
                class="button-cancel">
          <span>Cancel</span>
          <IconCancel/>
        </Button>
        <Button outline @click.native="handleRestart" v-if="build.finished" :disabled="!isCollaborator">
          <span>Restart</span>
          <IconRestart/>
        </Button>
      </div>
    </PageHeader>


    <Alert v-if="error" style="margin-top:30px;">
      Repository Not Found.
    </Alert>

    <!--
         this section provides the repository navigation bar. It is
         enabled for all sub-pages with the exception of the build
         page.
    -->
    <nav v-if="$route.params.build">
      <router-link :to="'/'+slug" class="manually-active">
        <IconArrow direction="left"/>
        <span>Activity Feed</span>
      </router-link>
    </nav>

    <nav v-else-if="showTabs">
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
import IconCancel from "@/components/icons/IconCancel.vue";
import Button from "@/components/buttons/Button.vue";
import Card from "@/components/Card.vue";
import PageHeader from "@/components/PageHeader";
import Link from "@/components/Link";
import IconRestart from "@/components/icons/IconRestart.vue";

export default {
  name: "repo",
  components: {
    PageHeader,
    Alert,
    Breadcrumb,
    IconArrow,
    IconCancel,
    IconRestart,
    Button,
    Card,
    Link
  },
  computed: {
    slug() {
      return this.$route.params.namespace + '/' + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    user() {
      return this.$store.state.user;
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
      return this.isCollaborator;
    },
    isCollaborator() {
      return (this.repo && this.repo.permissions && this.repo.permissions.write) ||
        (this.user && this.user.admin);
    },
    build() {
      const { builds } = this.$store.state;
      return this.repo && builds[this.slug] && builds[this.slug][this.$route.params.build];
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
    handleCancel: function() {
      const { namespace, name, build } = this.$route.params;
      this.$store.dispatch("cancelBuild", { namespace, name, build });
    },
    handleRestart: function() {
      const { namespace, name, build } = this.$route.params;

      let router = this.$router;
      this.$store.dispatch("createBuild", { namespace, name, build }).then(data => {
        router.push(`/${namespace}/${name}/${data.build.number}`);
      });
    }
  }
};
</script>

<style scoped>
.repo-name-breadcrumb {
  max-width: 500px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
  padding: 2px 0;
}

.repo-name-breadcrumb.link:focus:after,
.repo-name-breadcrumb.link:hover:after {
  bottom: 0;
}

.secondary-page-header {
  height: auto;
  margin-bottom: 30px;
}

h1 {
  line-height: 38px;
  font-size: 28px;
}

.button-cancel svg {
  width: 15px;
  height: 15px;
  margin-bottom: -2px;
}

nav {
  border-bottom: 1px solid rgba(25, 45, 70, 0.05);
  margin-bottom: 20px;
  padding-left: 15px;
  display: flex;
}

nav a {
  color: rgba(25, 45, 70, 0.6);
  height: 18px;
  line-height: 18px;
  padding-bottom: 11px;
  text-transform: uppercase;
  margin-bottom: -1px;
  letter-spacing: 0.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-right: 30px;
  border-bottom: 1px solid transparent;
}

nav a.manually-active {
  color: #192d46;
}

nav a:hover,
nav a:focus {
  color: #192d46;
}

nav a.manually-active:focus,
nav a.manually-active:hover {
  color: #0564d7;
}

nav a[disabled],
nav a[disabled]:hover,
nav a[disabled]:focus {
  pointer-events: none;
  color: rgba(25, 45, 70, 0.25);
}

nav a svg {
  margin: 0 5px 0 0;
}

nav .router-link-exact-active {
  border-color: #192d46;
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

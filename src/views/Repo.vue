<template>
  <div class="repo">
    <PageHeader>
      <Breadcrumb>
        <router-link v-if="userPresent" :to="'/'" class="link">Repositories</router-link>
        <span v-else>Repositories</span>

        <router-link v-if="$route.params.build" :to="'/'+slug" class="link repo-name-breadcrumb" :title="slug">{{ slug }}</router-link>
        <span :title="slug" v-else>{{ slug }}</span>

        <span v-if="$route.params.build">#{{ $route.params.build }}</span>
      </Breadcrumb>
    </PageHeader>

    <AlertError v-if="!repo" :error="error || null">
      Repository Not Found.
    </AlertError>

    <Loading v-if="loading" text="Loading repository"/>

    <PageHeader class="secondary-page-header">
      <h1 v-if="repo">{{ repo.name }}</h1>
      <portal-target name="secondary-page-header-actions" slim/>
    </PageHeader>

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
    <Alert v-else-if="repoEnabling">Activating...</Alert>
    <Card v-else-if="showActivatePrompt" class="activate" contentPadding="40px">
      <IconActivateGear/>
      <Button theme="primary" @click.native="handleActivate" :disabled="repoEnabling" size="l">
        Activate repository
      </Button>
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
import AlertError from "@/components/AlertError.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import IconArrow from "@/components/icons/IconArrow.vue";
import IconCancel from "@/components/icons/IconCancel.vue";
import IconActivateGear from "@/components/icons/IconActivateGear.vue";
import Button from "@/components/buttons/Button.vue";
import Card from "@/components/Card.vue";
import PageHeader from "@/components/PageHeader";
import Link from "@/components/Link";
import IconRestart from "@/components/icons/IconRestart.vue";
import Loading from "@/components/Loading.vue";

export default {
  name: "repo",
  components: {
    PageHeader,
    Alert,
    AlertError,
    Breadcrumb,
    IconArrow,
    IconCancel,
    IconRestart,
    IconActivateGear,
    Button,
    Card,
    Loading,
    Link
  },
  computed: {
    slug() {
      return this.$route.params.namespace + "/" + this.$route.params.name;
    },
    repo() {
      return this.$store.state.repos[this.slug];
    },
    user() {
      return this.$store.state.user.data;
    },
    repoEnabling() {
      return this.$store.state.repoEnabling;
    },
    repoEnablingErr() {
      return this.$store.state.repoEnablingErr;
    },
    loading() {
      return !this.repo && this.$store.state.repoLoading;
    },
    error() {
      const { repoLoading, repoLoaded, repoLoadingErr } = this.$store.state;
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
      return (this.repo && this.repo.permissions && this.repo.permissions.write) || (this.user && this.user.admin);
    },
    build() {
      const collection = this.$store.state.builds[this.slug];
      return this.repo && collection && collection.data[this.$route.params.build];
    },
    userPresent() {
      return this.$store.state.user.dStatus === "present";
    }
  },
  methods: {
    handleActivate: function() {
      const { namespace, name } = this.$route.params;
      this.$store.dispatch("enableRepo", {
        namespace: namespace,
        name: name
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.breadcrumb {
  padding: 2px 0;
  line-height: 16px;
  display: inline-block;

  &.link:focus:after,
  &.link:hover:after {
    bottom: 0;
  }
}

.repo-name-breadcrumb {
  max-width: 500px;
}

.page-header.secondary-page-header {
  height: auto;
  margin-bottom: 20px;

  @include tablet {
    flex-direction: column;
    align-items: flex-start;
  }
}

h1 {
  line-height: 38px;
  font-size: 28px;

  @include tablet {
    flex-direction: column;
  }
}

nav {
  border-bottom: 1px solid $border-color;
  margin-bottom: 20px;
  padding-left: 15px;
  display: flex;

  svg {
    opacity: 0.6;
  }

  @include mobile {
    padding-left: 10px;
    font-size: 13px;
    margin-bottom: 10px;
  }
}

nav a {
  color: $color-text-secondary;
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

  @include mobile {
    letter-spacing: normal;
    margin-right: 20px;
    padding-bottom: 5px;
  }
}

nav a.manually-active {
  color: $color-text;
}

nav a:hover,
nav a:focus {
  color: $color-text;

  svg {
    opacity: 1;
  }
}

nav a.manually-active:focus,
nav a.manually-active:hover {
  color: $color-primary;
}

nav a[disabled],
nav a[disabled]:hover,
nav a[disabled]:focus {
  pointer-events: none;
  color: rgba($color-text, 0.25);
}

nav a svg {
  margin: 0 5px 0 0;
}

nav .router-link-exact-active {
  border-color: $color-text;
  color: $color-text;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.alert.activate button {
  margin-right: 10px;
}

.activate {
  text-align: center;
}

.icon-activate-gear {
  margin: 0 auto 30px;
  display: block;
}
</style>

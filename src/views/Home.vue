<template>
  <div class="page-home">
    <PageHeader>
      <Breadcrumb>
        <span>Repositories</span>
      </Breadcrumb>

      <div>
        <Button @click.native="sync" outline :class="{ syncing }">
          <span>{{ syncing ? "Syncing" : "Sync"}}</span>
          <IconSync/>
        </Button>
      </div>
    </PageHeader>

    <AlertError :error="loadingError || syncingError"/>
    <RepoList v-if="!loadingError"
              :items="sortLimit(latest)"
              emptyMessage="Your repository list is empty."
              :loading="showLoading"
              :repoToProps="repoToProps"/>

    <MoreButton v-if="showMore" @click.native="showAll">Show all repositories</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import AlertError from "@/components/AlertError.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import IconSync from "@/components/icons/IconSync.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import Button from "@/components/buttons/Button.vue";
import RepoList from "@/components/RepoList.vue";
import PageHeader from "@/components/PageHeader";

import reposSort from "@/lib/reposSort";

const LIMIT = 10;

export default {
  name: "Home",
  components: {
    PageHeader,
    Alert,
    AlertError,
    Breadcrumb,
    MoreButton,
    Button,
    IconSync,
    RepoList
  },
  data() {
    return {
      all: false
    };
  },
  computed: {
    latest() {
      return this.$store.state.latest;
    },
    loadingStatus() {
      return this.$store.state.latestStatus;
    },
    showLoading() {
      return this.loadingStatus === "loading" && this.$store.state.latestUpdated === 0;
    },
    loadingError() {
      return this.loadingStatus === "error" ? this.$store.state.latestLoadingError : null;
    },
    syncing() {
      return this.$store.state.user && this.$store.state.user.data.syncing;
    },
    syncingError() {
      return this.$store.state.user ? this.$store.state.user.data.syncingError : null;
    },
    count() {
      return Object.keys(this.latest).length;
    },
    showMore() {
      return this.loadingStatus === "loaded" && !this.all && this.count > LIMIT;
    },
    mediaType() {
      return this.$store.state.mediaType;
    }
  },
  methods: {
    sortLimit: function(items) {
      let list = Object.values(items || {});

      list = reposSort(list);

      return this.all ? list : list.slice(0, LIMIT);
    },
    showAll: function() {
      this.all = true;
    },
    sync: function() {
      if (!this.syncing) {
        this.$store.dispatch("syncAccount");
      }
    },
    repoToProps(repo) {
      return {
        ...RepoList.defaultRepoToProps(repo),
        linkRepo: repo
      };
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/mixins";

.button.syncing {
  opacity: 0.6;

  svg {
    animation: spin 1s linear infinite;
  }
}

.alert {
  margin-bottom: 15px;
}

.alert small {
  font-style: italic;
}

.fade-enter {
  opacity: 0;
}

.more-button {
  margin: 15px 0 0 12px;

  @include mobile {
    margin-left: 7px;
  }
}
</style>

<style>
.page-home .alert-syncing .content {
  height: 40px;
  padding: 20px !important;
}
</style>

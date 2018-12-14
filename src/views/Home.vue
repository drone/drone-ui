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

    <transition name="fade">
      <Alert v-show="showSyncingAlert" class="alert">
        Your repository list is being synchronized.
        <small slot="secondary">This could take between 30 and 60 seconds to complete.</small>
      </Alert>
    </transition>

    <RepoList :items="sortLimit(latest)" emptyMessage="Your repository list is empty." :loading="loading"/>

    <MoreButton v-if="showMore" @click.native="showAll">Show all repositories</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import IconSync from "@/components/icons/IconSync.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import Button from "@/components/buttons/Button.vue";
import RepoList from "@/components/RepoList.vue";
import PageHeader from "@/components/PageHeader";

import reposSort from "@/lib/reposSort";

const LIMIT = 10;

export default {
  name: "home",
  components: {
    PageHeader,
    Alert,
    Breadcrumb,
    MoreButton,
    Button,
    IconSync,
    RepoList
  },
  data() {
    return {
      all: false,
    }
  },
  computed: {
    latest() {
      return this.$store.state.latest;
    },
    loaded() {
      return this.$store.state.latestStatus === 'loaded';
    },
    loading() {
      return this.$store.state.latestStatus === "loading";
    },
    syncing() {
      return this.$store.state.user &&
        this.$store.state.user.syncing;
    },
    empty() {
      return this.count === 0;
    },
    count() {
      return Object.keys(this.latest).length;
    },
    showSyncingAlert() {
      return this.syncing;
    },
    showMore() {
      return this.loaded && !this.all && this.count > LIMIT;
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
        this.$store.dispatch('syncAccount');
      }
    }
  }
};
</script>

<style scoped>
.syncing {
  opacity: 0.6;
}

.syncing svg {
  animation: spin 1s linear infinite;
}

.alert {
  margin-bottom: 15px;
}

.alert small {
  font-style: italic;
}

.fade-enter-active {
  transition: opacity 0.75s;
}
.fade-leave-active {
  transition: none;
}
.fade-enter {
  opacity: 0;
}

.more-button {
  margin: 15px auto 0 12px;
}
</style>

<style>
.page-home .alert .content {
  height: 40px;
  padding: 20px !important;
}
</style>

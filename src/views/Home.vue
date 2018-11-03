<template>
  <div>

    <header>
      <Breadcrumb>
        <router-link :to="'/'">Repositories</router-link>
      </Breadcrumb>

      <SyncButton v-if="!syncing" v-on:click="sync">Synchronize</SyncButton>
      <div v-if="syncing" class="syncing"><IconSpinner /> Syncing</div>
    </header>

    <transition name="fade">
      <Alert v-show="showEmptyAlert">
        Your repository list is empty.
      </Alert>
    </transition>

    <transition name="fade">
      <Alert v-show="showSyncingAlert">
        Your repository list is being synchronized.
        <small>This could take between 30 and 60 seconds to complete.</small>
      </Alert>
    </transition>

    <router-link
      v-for="repo in sortLimit(latest)"
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
          :branch="repo.build.target"
          :reference="repo.build.ref"
          :created="repo.build.created"
          :started="repo.build.started"
          :finished="repo.build.finished"
          :avatar="repo.build.author_avatar"
        />
    </router-link>

    <MoreButton v-if="showMore" v-on:click="showAll">Show All Repositories</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import InactiveRepoItem from "@/components/InactiveRepoItem.vue";
import RepoItem from "@/components/RepoItem.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import BreadcrumbDivider from "@/components/BreadcrumbDivider.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import SyncButton from "@/components/buttons/SyncButton.vue";


export default {
  name: "home",
  components: {
    Alert,
    BreadcrumbDivider,
    Breadcrumb,
    InactiveRepoItem,
    MoreButton,
    RepoItem,
    IconSpinner,
    SyncButton
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
      return this.$store.state.latestLoaded;
    },
    syncing() {
      return this.$store.state.user &&
        this.$store.state.user.syncing;
    },
    empty() {
      return Object.keys(this.latest).length === 0;
    },
    showEmptyAlert() {
      return this.empty && this.loaded && !this.syncing;
    },
    showSyncingAlert() {
      return this.empty && this.loaded && this.syncing;
    },
    showMore() {
      return this.loaded && !this.all && !this.empty;
    }
  },
  methods: {
    sortLimit: function(items) {
      // TODO improve the sorting code here. It is currently
      // split into two separate sorting operations, but should
      // be possible to combine to a single operation.
      let list = Object.values(items || {});

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
    showAll: function() {
      this.all = true;
    },
    sync: function() {
      this.$store.dispatch('syncAccount');
    }
  },
};
</script>

<style scoped>
/* button {
  background: none;
  border: none;
  color: #8f99a4;
  cursor: pointer;
  font-size: 13px;
  padding: 0px;
} */

header {
  display: flex;
  align-items: center;
}

header .breadcrumb {
  flex: 1;
}

/* header button {
  display: flex;
  margin-right: 15px;
  outline: none;
}

header button svg {
  fill: #8f99a4;
  width: 16px;
  height: 16px;
  margin-right: 5px;
} */

.syncing {
  align-items: center;
  background: #ffd300;
  border-radius: 3px;
  color: #FFF;
  display: flex;
  font-size: 12px;
  padding: 3px 10px;
  text-transform: uppercase;
}

.syncing svg {
  fill: #FFF;
  width: 14px;
  height: 14px;
  margin-right: 5px;
  animation: spin 1s linear infinite;
}

@keyframes spin{
	0%{transform:rotate(0deg)}
	100%{transform:rotate(359deg)}
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


.repo-item:first-of-type {
  margin-top: 0px;
}

.more-button {
  margin-top: 10px;
}
</style>

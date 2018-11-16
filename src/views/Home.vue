<template>
  <div>

    <header>
      <Breadcrumb>
        <span>
          Repositories
          <span class="count">— {{ reposCount(latest) }}</span>
        </span>
      </Breadcrumb>

      <ReButton v-if="!syncing" class='sync-button' @click.native="sync">Sync</ReButton>
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

    <div class="list">
      <div class="list-item"
           v-for="repo in sortLimit(latest)"
           :key="repo.id">

        <RepoLink :repo="repo">
          <ShortRepoItem v-if="!repo.build"
                         :namespace="repo.namespace"
                         :name="repo.name"
                         :active="repo.active"
          />

          <RepoItem v-if="repo.build"
                    :title="`${repo.namespace}/${repo.name}`"
                    :build="repo.build"
                    :status="repo.build.status"
                    :message="repo.build.message"
                    :avatar="repo.build.author_avatar"
                    :hide="['commit']"/>
        </RepoLink>
      </div>
    </div>

    <MoreButton v-if="showMore" @click.native="showAll">Show All Repositories</MoreButton>
  </div>
</template>

<script>
import Alert from "@/components/Alert.vue";
import ShortRepoItem from "@/components/ShortRepoItem.vue";
import RepoItem from "@/components/RepoItem.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import IconSpinner from "@/components/icons/IconSpinner.vue";
import MoreButton from "@/components/buttons/MoreButton.vue";
import ReButton from "@/components/buttons/ReButton.vue";
import RepoLink from "@/components/RepoLink.vue";

import reposSort from "@/lib/reposSort";

export default {
  name: "home",
  components: {
    Alert,
    Breadcrumb,
    ShortRepoItem,
    MoreButton,
    RepoItem,
    IconSpinner,
    ReButton,
    RepoLink
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
      let list = Object.values(items || {});

      list = reposSort(list);

      return this.all ? list : list.slice(0, 10);
    },
    showAll: function() {
      this.all = true;
    },
    sync: function() {
      this.$store.dispatch('syncAccount');
    },
    reposCount: function(items) {
      return Object.keys(items).length;
    }
  }
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
}

header .breadcrumb {
  flex: 1;
}

.count {
  opacity: 0.667; /* 0.75*0.667=0.5 */
}

.sync-button {
  margin-right: 15px;
}

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

.more-button {
  margin: 20px auto 0 22px;
}

.list-item + .list-item {
  margin-top: 10px;
}
</style>

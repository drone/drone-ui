<template>
  <div>

    <header>
      <Breadcrumb>
        <router-link :to="'/'">Repositories</router-link>
        <BreadcrumbDivider />
        <router-link :to="'/'">Dashboard</router-link>
      </Breadcrumb>

      <button v-if="!syncing" v-on:click="sync"><Running /> Sync Repositories</button>
      <div v-if="syncing" class="syncing"><Running /> Syncing</div>
    </header>

    <transition name="fade">
      <div v-show="empty" class="alert empty">
        Your repository list is empty.
      </div>
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
          :branch="repo.build.branch"
          :reference="repo.build.ref"
          :created="repo.build.created"
          :started="repo.build.started"
          :finished="repo.build.finished"
          :avatar="repo.build.author_avatar"
        />
    </router-link>

    <button v-if="!all && !empty" v-on:click="showAll">Show All Repositories</button>
  </div>
</template>

<script>
import InactiveRepoItem from "@/components/InactiveRepoItem.vue";
import RepoItem from "@/components/RepoItem.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import BreadcrumbDivider from "@/components/BreadcrumbDivider.vue";
import Running from "@/components/icons/Running.vue";

export default {
  name: "home",
  components: {
    BreadcrumbDivider,
    Breadcrumb,
    InactiveRepoItem,
    RepoItem,
    Running
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
    syncing() {
      return this.$store.state.user &&
        this.$store.state.user.syncing;
    },
    // latest() {
    //   return this.$store.state.latest;
    // },
    // repos() {

    // },
    empty() {
      return this.repos && this.repos.length === 0 &&
        this.$store.state.latestLoaded;
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

  // /**
  //  * A navigation guard restricts this view to authenticated
  //  * user accounts. If the user is not authenticated, they
  //  * are redirected to the login screen.
  //  * 
  //  * If the user is authenticated, the guard dispatches a
  //  * request to load the repository list.
  //  * 
  //  * @param {*} to 
  //  * @param {*} from 
  //  * @param {*} next 
  //  */
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (!vm.$store.state.user) {
  //       window.location.href='/login';
  //       return;
  //     }

  //     if (!vm.$store.latestLoaded) {
  //       vm.$store.dispatch('fetchReposLatest', to.params);
  //     }
  //   })
  // }
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  color: #8f99a4;
  cursor: pointer;
  font-size: 13px;
  padding: 0px;
}

.alert.empty {
  background: #FFF;
  border: 1px solid #e8eaed;
  border-radius: 3px;
  box-shadow: 0px 0px 8px 1px #e8eaed;
  margin: 30px 0px;
  padding: 30px 15px;
  text-align: center;
}

header {
  display: flex;
  align-items: center;
}
header .breadcrumb {
  flex: 1;
}
header button {
  display: flex;
  margin-right: 15px;
  outline: none;
}

header button svg {
  fill: #8f99a4;
  width: 16px;
  height: 16px;
  margin-right: 5px;
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

.alert.fade-enter-active,
.alert.fade-leave-active {
  transition: opacity 1s;
}
.alert.fade-enter,
.alert.fade-leave-to {
  opacity: 0;
}
</style>

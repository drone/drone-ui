import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import AnsiUp from "ansi_up";
import * as config from "./actions/config";

Vue.use(Vuex);

const DEFAULT_LOG_LIMIT = 250;

function mergeRepoChanges(prev, next) {
  return {
    permissions: prev.permissions,
    ...next
  };
}

function updateBuildsFeedByBuildEvent(state, event) {
  const builds = state.buildsFeed.data;
  let index = -1;

  for (let i = 0; i < builds.length; ++i) {
    if (builds[i].id === event.id && builds[i].build.id === event.build.id) {
      index = i;
      break;
    }
  }

  const found = index !== -1;

  if (found) {
    if (event.build.finished) {
      Vue.delete(state.buildsFeed.data, index);
    } else {
      Vue.set(state.buildsFeed.data, index, event);
    }
  } else {
    if (!event.build.finished) {
      state.buildsFeed.data.push(event);
    }
  }
}

export default new Vuex.Store({
  state: {
    route: {
      params: {}
    },

    instance: {
      url: config.instance || `${window.location.protocol}//${window.location.host}`
    },

    latest: {},
    latestUpdated: 0,
    latestLoaded: false,

    repos: {},

    repoLoaded: false,
    repoLoading: false,
    repoLoadingErr: undefined,

    repoEnabling: false,
    repoEnablingErr: undefined,

    // repoEnabling: false,
    // repoEnablingErr: undefined,

    // repoDisabling: false,
    // repoDisablingErr: undefined,

    // repoSaving: false,
    // repoSavingErr: undefined,

    builds: {},
    buildLoaded: false,
    buildLoading: false,
    buildLoadingErr: undefined,

    buildsFeed: {
      data: [],
      status: "empty", // 'loading', 'loaded', 'error'
      error: undefined
    },

    secrets: {},
    crons: {},
    activity: {},

    user: undefined,
    userLoaded: false,

    logs: [],
    logsLoaded: false,
    logsLoading: false,
    logsLoadingErr: undefined,
    logsLimit: DEFAULT_LOG_LIMIT,
    logsFor: {
      namespace: undefined,
      name: undefined,
      build: undefined,
      stage: undefined,
      step: undefined,
    },

    notifications: {}
  },
  mutations: {
    // BEFORE_ROUTE_LOAD(state) {
    //   // reset repository fetch states.
    //   state.repoLoading = false;
    //   state.repoLoaded = false;
    //   state.repoLoadingErr = undefined;

    //   // reset repository enable states.
    //   state.repoEnabling = false;
    //   state.repoEnablingErr = undefined;
    // },

    REPO_FIND_LOADING(state) {
      state.repoEnabling = false;
      state.repoEnablingErr = undefined;
      state.repoLoading = true;
      state.repoLoaded = false;
      state.repoLoadingErr = undefined;
    },
    REPO_FIND_FAILURE(state, error) {
      state.repoLoading = false;
      state.repoLoaded = true;
      state.repoLoadingErr = {error: {status: 404}};
    },
    REPO_FIND_SUCCESS(state, item) {
      state.repoLoading = false;
      state.repoLoaded = false;
      state.repoLoadingErr = undefined;
      Vue.set(state.repos, item.slug, item);
    },

    //
    // repo list
    //

    REPO_LIST_LOADING(state) {},
    REPO_LIST_FAILURE(state, error) {},
    REPO_LIST_SUCCESS(state, list) {
      state.repos = {}
			list.map(item => {
				state.repos[item.slug] = item;
			});
    },

    //
    // repo list + latest build
    //

    REPO_LIST_LATEST_LOADING(state) {},
    REPO_LIST_LATEST_FAILURE(state, error) {},
    REPO_LIST_LATEST_SUCCESS(state, list) {
      const latest = {};
			list.forEach(item => latest[item.slug] = item);

      state.latest = latest;
      state.latestLoaded = true;
      state.latestUpdated = Math.round((new Date()).getTime() / 1000);
    },

    //
    // repo update
    //

    REPO_UPDATE_LOADING(state) {},
    REPO_UPDATE_FAILURE(state) {},
    REPO_UPDATE_SUCCESS(state, { repo }) {
      state.repos[repo.slug] = mergeRepoChanges(state.repos[repo.slug], repo);
    },

    REPO_ENABLE_LOADING(state) {
      state.repoEnabling = true;
      state.repoEnablingErr = undefined;
    },
    REPO_ENABLE_FAILURE(state, {error}) {
      state.repoEnabling = false;
      state.repoEnablingErr = error;
    },
    REPO_ENABLE_SUCCESS(state, { repo }) {
      state.repoEnabling = false;
      state.repoEnablingErr = undefined;
      state.repos[repo.slug] = mergeRepoChanges(state.repos[repo.slug], repo);
    },

    REPO_DISABLE_LOADING(state) {},
    REPO_DISABLE_FAILURE(state, {error}) {},
    REPO_DISABLE_SUCCESS(state, { repo }) {
      state.repoEnabling = false;
      state.repoEnablingErr = undefined;
      state.repos[repo.slug] = mergeRepoChanges(state.repos[repo.slug], repo);
    },

    REPO_REPAIR_LOADING(state) {},
    REPO_REPAIR_SUCCESS(state) {},
    REPO_REPAIR_FAILURE(state) {},

    REPO_CHOWN_LOADING(state) {},
    REPO_CHOWN_SUCCESS(state) {},
    REPO_CHOWN_FAILURE(state) {},

    //
    // build list
    //

    BUILD_LIST_LOADING(state){},
    BUILD_LIST_FAILURE(state){},
    BUILD_LIST_SUCCESS(state, {params, builds}){
      const ns = `${params.namespace}/${params.name}`;
      let tmp = state.builds[ns];
      if (!tmp) {
        tmp = {};
      }
			builds.map(item => {
        Vue.set(tmp, item.number, item);
      });
      Vue.set(state.builds, ns, tmp);
    },

    //
    // build
    //

    BUILD_FIND_LOADING(state){
      state.buildLoaded = false;
      state.buildLoading = true;
      state.buildLoadingErr = undefined;
    },
    BUILD_FIND_FAILURE(state, {error}){
      state.buildLoaded = true;
      state.buildLoading = false;
      state.buildLoadingErr = error;
    },
    BUILD_FIND_SUCCESS(state, data){
      state.buildLoaded = true;
      state.buildLoading = false;
      state.buildLoadingErr = undefined;

      const slug = `${data.params.namespace}/${data.params.name}`;
      let builds = state.builds[slug];
      if (!builds) {
        Vue.set(state.builds, slug, {[data.build.number]: data.build});
      } else {
        builds[data.build.number] = data.build;
        Vue.set(state.builds, slug, builds);
      }
    },

    //
    // secrets
    //

    SECRET_LIST_LOADING(state){},
    SECRET_LIST_FAILURE(state){},
    SECRET_LIST_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let set = {};
			data.secrets.map(item => {
				set[item.name] = item;
			});
      Vue.set(state.secrets, slug, set);
    },

    SECRET_CREATE_LOADING(state){},
    SECRET_CREATE_FAILURE(state, e) {
      Vue.set(state, "secretCreationError", e.error);
    },
    SECRET_CREATE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let secrets = state.secrets[slug];
      if (!secrets) {
        Vue.set(state.secrets, slug, {[data.secret.name]: data.secret});
      } else {
        Vue.set(secrets, data.secret.name, data.secret);
        Vue.set(state.secrets, slug, secrets);
      }
    },

    SECRET_DELETE_LOADING(state){},
    SECRET_DELETE_FAILURE(state, data){},
    SECRET_DELETE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let secrets = state.secrets[slug];
      if (secrets) {
        Vue.delete(secrets, data.secret.name, data.secret);
        Vue.set(state.secrets, slug, secrets);
      }
    },

    //
    // cron
    //

    CRON_LIST_LOADING(state){},
    CRON_LIST_FAILURE(state, e){
      console.log(e)
    },
    CRON_LIST_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let set = {};
			data.secrets.map(item => {
				set[item.name] = item;
			});
      Vue.set(state.crons, slug, set);
    },
  
    CRON_CREATE_LOADING(state){},
    CRON_CREATE_FAILURE(state, e) {
      Vue.set(state, "cronCreationError", e.error);
    },
    CRON_CREATE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let crons = state.crons[slug];
      if (!crons) {
        Vue.set(state.crons, slug, {[data.cron.name]: data.cron});
      } else {
        Vue.set(crons, data.cron.name, data.cron);
        Vue.set(state.crons, slug, crons);
      }
    },

    CRON_DELETE_LOADING(state){},
    CRON_DELETE_FAILURE(state, e){
      console.log(e)
    },
    CRON_DELETE_SUCCESS(state, data){
      const slug = `${data.namespace}/${data.name}`;
      let crons = state.crons[slug];
      if (crons) {
        Vue.delete(crons, data.cron.name, data.cron);
        Vue.set(state.crons, slug, crons);
      }
    },

    //
    // user
    //

    VIEWER_FIND_LOADING(state){},
    VIEWER_FIND_FAILURE(state){
      state.userLoaded = true;
      state.user = undefined;
    },
    VIEWER_FIND_SUCCESS(state, res){
      state.userLoaded = true;
      state.user = res;
    },

    //
    // user token
    //

    VIEWER_FINE_TOKEN_LOADING(state){},
    VIEWER_FIND_TOKEN_FAILURE(state){},
    VIEWER_FIND_TOKEN_SUCCESS(state, res){
      state.userLoaded = true;
      state.user = res;
    },

    //
    // events
    //

    BUILD_EVENT(state, {event}) {
      const builds = state.builds[event.slug] || {};
			Vue.set(builds, event.build.number, event.build);
      Vue.set(state.builds, event.slug, builds);

      const latest = state.latest[event.slug];
      if (latest && (!latest.build || latest.build.number <= event.build.number)) {
        Vue.set(state.latest, event.slug, event);
      }

      updateBuildsFeedByBuildEvent(state, event);
    },

    BUILD_RETRY_LOADING(state){},
    BUILD_RETRY_FAILURE(state){},
    BUILD_RETRY_SUCCESS(state, {namespace, name, build}){
      let slug = `${namespace}/${name}`;
      let builds = state.builds[slug] || {};
			Vue.set(builds, build.number, build);
      Vue.set(state.builds, slug, builds);
    },

    BUILD_CANCEL_LOADING(state){},
    BUILD_CANCEL_FAILURE(state){},
    BUILD_CANCEL_SUCCESS(state, {namespace, name, build}){
      let slug = `${namespace}/${name}`;
      let builds = state.builds[slug] || {};
			Vue.set(builds, build.number, build);
      Vue.set(state.builds, slug, builds);
    },

    BUILDS_FEED_LOADING(state) {
      state.buildsFeed.status = "loading";
    },
    BUILDS_FEED_FAILURE(state, { error }) {
      state.buildsFeed.status = "error";
      state.buildsFeed.error = error;
    },
    BUILDS_FEED_SUCCESS(state, { builds }) {
      state.buildsFeed.status = "loaded";
      state.buildsFeed.data = builds;
    },

    //
    // sync
    //

    VIEWER_SYNC_STARTING(state){
      state.user.syncing = true;
    },
    VIEWER_SYNC_FAILURE(state){
      state.user.syncing = false;
    },
    VIEWER_SYNC_SUCCESS(state){
      state.user.syncing = true;
    },



    LOGS_FIND_LOADING(state){
      state.logs = [];
    },
    LOGS_FIND_FAILURE(state){},
    LOGS_FIND_SUCCESS(state, data){
      escapeLogs(data.lines);
      state.logs = data.lines;
    },
    LOGS_EXPAND(state) {
      state.logsLimit = state.logsLimit + DEFAULT_LOG_LIMIT;
    },
    LOG_CLEAR(state) {
      state.logs = [];
      state.logsLimit = DEFAULT_LOG_LIMIT;
    },
    LOG_WRITE(state, { lines }) {
      if (!state.logs) state.logs = [];
      escapeLogs(lines);
      state.logs = state.logs.concat(lines);
    },

    NOTIFICATION_ADD(state, notification) {
      Vue.set(state.notifications, notification.id, notification);
    },
    NOTIFICATION_REMOVE(state, notificationId) {
      Vue.delete(state.notifications, notificationId);
    }
  },
  actions: {
    ...actions,

    expandLogs({commit}) {
      commit('LOGS_EXPAND');
    }
  },
});


let formatter = new AnsiUp();
formatter.use_classes = true;

function escapeLogs(logs) {
  for (let i = 0; i < logs.length; ++i) {
    logs[i]._html = formatter.ansi_to_html(logs[i].out || "");
  }
}

import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import AnsiUp from "ansi_up";
import * as config from "./actions/config";
import { isBuildFinished } from "@/lib/buildHelper";

Vue.use(Vuex);

function mergeRepoChanges(prev, next) {
  return {
    permissions: prev.permissions,
    ...next
  };
}

function updateBuildsFeedByBuild(state, build) {
  const builds = state.buildsFeed.data;
  for (let i = 0; i < builds.length; ++i) {
    if (builds[i].build.id === build.id) {
      Vue.delete(state.buildsFeed.data, i);
      break;
    }
  }
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
  const isFinished = isBuildFinished(event.build);

  if (found) {
    if (isFinished) {
      Vue.delete(state.buildsFeed.data, index);
    } else {
      Vue.set(state.buildsFeed.data, index, event);
    }
  } else {
    if (!isFinished) {
      state.buildsFeed.data.push(event);
    }
  }
}

function createEmptyCollection(data = null) {
  return {
    data,
    dStatus: "empty", // "present" - dataStatus
    lStatus: "none", // 'loading', 'loaded', 'error' - loadingStatus
    error: null
  };
}

function createPresentCollection(data) {
  return {
    data,
    dStatus: "present",
    lStatus: "loaded",
    error: null
  };
}

function applyLoading(collection) {
  collection.lStatus = "loading";
}

function applyFailure(collection, error) {
  collection.lStatus = "error";
  collection.error = error;
}

function applySuccess(collection, data) {
  collection.lStatus = "loaded";
  collection.dStatus = "present";

  if (data !== undefined) {
    collection.data = data;
  }
}

function insertEmptyBuildsCollection(data, slug) {
  Vue.set(data, slug, {
    data: {},
    dStatus: "empty",
    lStatus: "none", // 'loading', 'loaded', 'error'
    error: null,
    page: null,
    lPage: null
  });
}

function insertEmptyBuildCollection(data, number) {
  Vue.set(data, number, createEmptyCollection());
}

function insertBuildCollection(data, number, build) {
  Vue.set(data, build.number, createPresentCollection(build));
}

export default new Vuex.Store({
  state: {
    mediaType: window.innerWidth >= 980 ? "desktop" : window.innerWidth > 480 ? "tablet" : "mobile",

    route: {
      params: {}
    },

    from: null,

    instance: {
      url: config.instance || `${window.location.protocol}//${window.location.host}`
    },

    // todo use collection style (like object in builds[slug])
    latest: {},
    latestUpdated: 0,
    latestStatus: "empty", // "empty", 'loading', 'loaded', 'error'
    latestLoadingError: null,

    repos: {},

    repoLoaded: false,
    repoLoading: false,
    repoLoadingErr: undefined,

    repoEnabling: false,
    repoEnablingErr: undefined,

    branches: {},
    deployments: {},

    builds: {
      /*
      EXAMPLE:
      "namespace/name": {
        data: {
          "number": {
             data: null,
             dStatus: "empty", // "present" - dataStatus
             lStatus: "none", // 'loading', 'loaded', 'error' - loadingStatus
             error: undefined,
          }
        },
        dStatus: "empty", // "present" - dataStatus
        lStatus: "none", // 'loading', 'loaded', 'error' - loadingStatus
        error: undefined,
        page: undefined, // last loaded page
        lPage: undefined, // loading page
      }
      */
    },

    // buildLoaded: false,
    // buildLoading: false,
    // buildLoadingErr: undefined,

    // todo use separated statuses (l and d)
    buildsFeed: {
      data: [],
      status: "empty", // 'loading', 'loaded', 'error'
      error: undefined
    },

    secrets: {},
    crons: {},
    activity: {},

    user: {
      data: null,
      lStatus: "none", // or 'loading', 'loaded', 'error'
      dStatus: "empty", // 'present'
      error: null,
      syncing: false,
      syncingError: null,
      tokenLoading: false
    },

    logs: createEmptyCollection([]),

    notifications: {}
  },
  getters: {
    userPresent(state) {
      return state.user.dStatus === "present";
    }
  },
  mutations: {
    REPO_FIND_LOADING(state) {
      state.repoEnabling = false;
      state.repoEnablingErr = undefined;
      state.repoLoading = true;
      state.repoLoaded = false;
      state.repoLoadingErr = undefined;
    },
    REPO_FIND_FAILURE(state, { error }) {
      state.repoLoading = false;
      state.repoLoaded = true;
      state.repoLoadingErr = error;
    },
    REPO_FIND_SUCCESS(state, { res: item }) {
      state.repoLoading = false;
      state.repoLoaded = false;
      state.repoLoadingErr = undefined;
      Vue.set(state.repos, item.slug, item);
    },

    //
    // repo list + latest build
    //

    REPO_LIST_LATEST_LOADING(state) {
      state.latestStatus = "loading";
    },
    REPO_LIST_LATEST_FAILURE(state, { error }) {
      state.latestStatus = "error";
      state.latestLoadingError = error;
    },
    REPO_LIST_LATEST_SUCCESS(state, { res }) {
      const latest = {};
      res.forEach(item => (latest[item.slug] = item));

      state.latest = latest;
      state.latestStatus = "loaded";
      state.latestUpdated = Math.round(new Date().getTime() / 1000);
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
    REPO_ENABLE_FAILURE(state, { error }) {
      state.repoEnabling = false;
      state.repoEnablingErr = error;
    },
    REPO_ENABLE_SUCCESS(state, { repo }) {
      state.repoEnabling = false;
      state.repoEnablingErr = undefined;
      state.repos[repo.slug] = mergeRepoChanges(state.repos[repo.slug], repo);
    },

    REPO_DISABLE_LOADING(state) {},
    REPO_DISABLE_FAILURE(state, { error }) {},
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
    // branch list
    //

    BRANCH_LIST_LOADING(state, { params }) {
      const slug = `${params.namespace}/${params.name}`;

      if (!state.branches[slug]) {
        insertEmptyBuildsCollection(state.branches, slug);
      }

      applyLoading(state.branches[slug]);
    },

    BRANCH_LIST_FAILURE(state, { params, error }) {
      const slug = `${params.namespace}/${params.name}`;
      applyFailure(state.branches[slug], error);
    },

    BRANCH_LIST_SUCCESS(state, { params, res }) {
      const slug = `${params.namespace}/${params.name}`;

      applySuccess(state.branches[slug]);
      res.forEach(item =>
        Vue.set(state.branches[slug].data, item.target, {
          data: item,
          lStatus: "loaded",
          dStatus: "present",
          error: undefined
        })
      );
    },

    DEPLOYMENT_LIST_LOADING(state, { params }) {
      const slug = `${params.namespace}/${params.name}`;

      if (!state.deployments[slug]) {
        insertEmptyBuildsCollection(state.deployments, slug);
      }

      applyLoading(state.deployments[slug]);
    },

    DEPLOYMENT_LIST_FAILURE(state, { params, error }) {
      const slug = `${params.namespace}/${params.name}`;
      applyFailure(state.deployments[slug], error);
    },


    DEPLOYMENT_LIST_SUCCESS(state, { params, res }) {
      const slug = `${params.namespace}/${params.name}`;

      applySuccess(state.deployments[slug]);

      res.forEach(item =>
        Vue.set(state.deployments[slug].data, item.deploy_to, {
          data: item,
          lStatus: "loaded",
          dStatus: "present",
          error: undefined
        })
      );
    },

    //
    // build list
    //

    BUILD_LIST_LOADING(state, { params }) {
      const slug = `${params.namespace}/${params.name}`;

      if (!state.builds[slug]) insertEmptyBuildsCollection(state.builds, slug);

      applyLoading(state.builds[slug]);
      state.builds[slug].lPage = params.page;
    },
    BUILD_LIST_FAILURE(state, { params, error }) {
      const slug = `${params.namespace}/${params.name}`;
      applyFailure(state.builds[slug], error);
    },
    BUILD_LIST_SUCCESS(state, { params, res }) {
      const slug = `${params.namespace}/${params.name}`;
      const repoBuilds = state.builds[slug];

      if (params.page === 1) {
        repoBuilds.data = {};
      }

      applySuccess(repoBuilds);
      repoBuilds.page = params.page;
      res.forEach(item =>
        Vue.set(repoBuilds.data, item.number, {
          data: item,
          lStatus: "loaded",
          dStatus: "present",
          error: undefined
        })
      );
    },

    //
    // build
    //

    BUILD_FIND_LOADING(state, { params }) {
      const slug = `${params.namespace}/${params.name}`;

      if (!state.builds[slug]) insertEmptyBuildsCollection(state.builds, slug, params.page);

      const slugBuildsData = state.builds[slug].data;
      if (!slugBuildsData[params.build]) insertEmptyBuildCollection(slugBuildsData, params.build);

      applyLoading(slugBuildsData[params.build]);
    },
    BUILD_FIND_FAILURE(state, { params, error }) {
      const slug = `${params.namespace}/${params.name}`;
      applyFailure(state.builds[slug].data[params.build], error);
    },
    BUILD_FIND_SUCCESS(state, { params, res: build }) {
      const slug = `${params.namespace}/${params.name}`;
      applySuccess(state.builds[slug].data[params.build], build);
    },

    BUILD_APPROVE_LOADING() {},
    BUILD_APPROVE_FAILURE() {},
    BUILD_APPROVE_SUCCESS() {},

    BUILD_DECLINE_LOADING() {},
    BUILD_DECLINE_FAILURE() {},
    BUILD_DECLINE_SUCCESS() {},

    //
    // secrets
    //

    SECRET_LIST_LOADING(state) {},
    SECRET_LIST_FAILURE(state) {},
    SECRET_LIST_SUCCESS(state, { params, res }) {
      const slug = `${params.namespace}/${params.name}`;
      let set = {};
      res.map(item => {
        set[item.name] = item;
      });
      Vue.set(state.secrets, slug, set);
    },

    SECRET_CREATE_LOADING(state) {},
    SECRET_CREATE_FAILURE(state, e) {
      Vue.set(state, "secretCreationError", e.error);
    },
    SECRET_CREATE_SUCCESS(state, data) {
      const slug = `${data.namespace}/${data.name}`;
      let secrets = state.secrets[slug];
      if (!secrets) {
        Vue.set(state.secrets, slug, { [data.secret.name]: data.secret });
      } else {
        Vue.set(secrets, data.secret.name, data.secret);
        Vue.set(state.secrets, slug, secrets);
      }
    },

    SECRET_DELETE_LOADING(state) {},
    SECRET_DELETE_FAILURE(state, data) {},
    SECRET_DELETE_SUCCESS(state, data) {
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

    CRON_LIST_LOADING(state) {},
    CRON_LIST_FAILURE(state, e) {
      console.log(e);
    },
    CRON_LIST_SUCCESS(state, data) {
      const slug = `${data.namespace}/${data.name}`;
      let set = {};
      data.secrets.map(item => {
        set[item.name] = item;
      });
      Vue.set(state.crons, slug, set);
    },

    CRON_CREATE_LOADING(state) {},
    CRON_CREATE_FAILURE(state, e) {
      Vue.set(state, "cronCreationError", e.error);
    },
    CRON_CREATE_SUCCESS(state, data) {
      const slug = `${data.namespace}/${data.name}`;
      let crons = state.crons[slug];
      if (!crons) {
        Vue.set(state.crons, slug, { [data.cron.name]: data.cron });
      } else {
        Vue.set(crons, data.cron.name, data.cron);
        Vue.set(state.crons, slug, crons);
      }
    },

    CRON_DELETE_LOADING(state) {},
    CRON_DELETE_FAILURE(state, e) {
      console.log(e);
    },
    CRON_DELETE_SUCCESS(state, data) {
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

    VIEWER_FIND_LOADING(state) {
      applyLoading(state.user);
    },
    VIEWER_FIND_FAILURE(state, { error }) {
      applyFailure(state.user, error);
    },
    VIEWER_FIND_SUCCESS(state, { res }) {
      applySuccess(state.user, res);
    },

    //
    // user token
    //

    VIEWER_FIND_TOKEN_LOADING(state) {
      state.user.tokenLoading = true;
    },
    VIEWER_FIND_TOKEN_FAILURE(state) {
      state.user.tokenLoading = false;
    },
    VIEWER_FIND_TOKEN_SUCCESS(state, { res }) {
      state.user.tokenLoading = false;
      state.user.data = res;
    },

    //
    // events
    //

    BUILD_EVENT(state, { repo }) {
      if (state.builds[repo.slug]) {
        insertBuildCollection(state.builds[repo.slug].data, repo.slug, repo.build);
      }

      const latest = state.latest[repo.slug];
      if (!latest) {
        return;
      }

      if (!latest.build || latest.build.number <= repo.build.number) {
        Vue.set(state.latest, repo.slug, repo);
      }

      updateBuildsFeedByBuildEvent(state, repo);
    },

    BUILD_RETRY_LOADING() {},
    BUILD_RETRY_FAILURE() {},
    BUILD_RETRY_SUCCESS(state, { namespace, name, build }) {
      const slug = `${namespace}/${name}`;

      if (state.builds[slug]) {
        insertBuildCollection(state.builds[slug].data, slug, build);
      }
    },

    BUILD_CANCEL_LOADING() {},
    BUILD_CANCEL_FAILURE() {},
    BUILD_CANCEL_SUCCESS(state, { namespace, name, build }) {
      const slug = `${namespace}/${name}`;

      if (state.builds[slug]) {
        insertBuildCollection(state.builds[slug].data, slug, build);
      }

      updateBuildsFeedByBuild(state, build)
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

    VIEWER_SYNC_STARTING(state) {
      state.user.data.syncing = true;
      state.user.data.syncingError = null;
    },
    VIEWER_SYNC_FAILURE(state, error) {
      state.user.data.syncing = false;
      state.user.data.syncingError = error;
    },
    VIEWER_SYNC_SUCCESS(state) {
      state.user.data.syncing = false;
      state.user.data.syncingError = null;
    },

    LOGS_FIND_LOADING(state) {
      applyLoading(state.logs);
    },
    LOGS_FIND_FAILURE(state, { error }) {
      applyFailure(state.logs, error);
    },
    LOGS_FIND_SUCCESS(state, data) {
      const lines = data.lines || [];
      escapeLogs(lines);
      applySuccess(state.logs, lines);
    },
    LOG_CLEAR(state) {
      state.logs = createEmptyCollection([]);
    },
    LOG_WRITE(state, { lines }) {
      applySuccess(state.logs);
      escapeLogs(lines);
      state.logs.data = state.logs.data.concat(lines);
    },

    NOTIFICATION_ADD(state, notification) {
      Vue.set(state.notifications, notification.id, notification);
    },
    NOTIFICATION_REMOVE(state, notificationId) {
      Vue.delete(state.notifications, notificationId);
    },

    SAVE_FROM_ROUTE(state, from) {
      state.from = from;
    }
  },
  actions
});

let formatter = new AnsiUp();
formatter.use_classes = true;

function escapeLogs(logs) {
  for (let i = 0; i < logs.length; ++i) {
    logs[i]._html = formatter.ansi_to_html(logs[i].out || "");
  }
}

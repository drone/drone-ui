import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    route: {
      params: {}
    },
    latest: {},
    repos: {},

    builds: {},
    secrets: {},
    crons: {},
    activity: {
    },

    user: undefined,
    userLoaded: false,
  },
  mutations: {

    REPO_FIND_LOADING(state) {},
    REPO_FIND_FAILURE(state, error) {},
    REPO_FIND_SUCCESS(state, item) {
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
      state.latest = {}
			list.map(item => {
				state.latest[item.slug] = item;
			});
    },

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

    BUILD_FIND_LOADING(state){},
    BUILD_FIND_FAILURE(state){},
    BUILD_FIND_SUCCESS(state, data){
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
    SECRET_CREATE_FAILURE(state){},
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
    CRON_CREATE_FAILURE(state, e){
      console.log(e)
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
    VIEWER_FIND_FAILURE(state){},
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
  },
  actions,
});

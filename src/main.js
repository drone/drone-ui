import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import {messages, resolve} from "./locales";
import router from "./router";
import store from "./store";
import { sync } from 'vuex-router-sync';

Vue.use(VueI18n)
Vue.config.productionTip = false;

sync(store, router)

router.beforeEach((to, from, next) => {
  const {name, params} = to;

  // fetch the repository information if
  // the route matches the following parameters:
  switch (name) {
  case "build":
  case "builds":
  case "cron":
  case "logs":
  case "repo":
  case "secrets":
  case "settings":
    store.dispatch('fetchRepo', params);   
    break
  }

  switch (name) {
  case "account":
    store.dispatch('fetchViewerToken', params);
    break
  case "build":
    store.dispatch('fetchBuild', params);
    break;
  case "builds":
    store.dispatch('fetchBuilds', params);
    break
  case "cron":
    store.dispatch('fetchCrons', params);
    break
  case "home":
    // store.dispatch('fetchRepos', params);
    store.dispatch('fetchReposLatest', params);
    break;
  case "logs":
    store.dispatch('fetchBuild', params);
    break;
  case "secrets":
    store.dispatch('fetchSecrets', params);
    break
  case "settings":
    store.dispatch('fetchSecrets', params);
    store.dispatch('fetchCrons', params);
  }

  next();
})

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: resolve(window),
  messages,
})

store.dispatch('fetchViewer');

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");

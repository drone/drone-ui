import Vue from "vue";
import Router from "vue-router";

import Account from "./views/Account.vue";
import Build from "./views/Build.vue";
import Builds from "./views/Builds.vue";
import Cron from "./views/Cron.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Logout from "./views/Logout.vue";
import Logs from "./views/Logs.vue";
import Main from "./views/Main.vue";
import Repo from "./views/Repo.vue";
import Secrets from "./views/Secrets.vue";
import Settings from "./views/Settings.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: Main,
      children: [
        {
          path: "",
          name: "home",
          component: Home
        },
        {
          path: "/account",
          name: "account",
          component: Account
        },
        {
          path: "/:namespace/:name/:build/:stage/:step",
          name: "logs",
          component: Logs
        },
        {
          path: "/:namespace/:name",
          component: Repo,
          children: [
            {
              path: "",
              name: "builds",
              component: Builds
            },
            {
              path: "cron",
              name: "cron",
              component: Cron
            },
            {
              path: "secrets",
              name: "secrets",
              component: Secrets
            },
            {
              path: "settings",
              name: "settings",
              component: Settings
            },
            {
              path: ":build",
              name: "build",
              component: Build
            },
          ]
        }
      ],
    },
    {
      path: "/login/form",
      name: "login",
      component: Login
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout
    },
  ]
});

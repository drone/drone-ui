import Router from "vue-router";

import Account from "../views/Account.vue";
import Build from "../views/Build.vue";
import Builds from "../views/Builds.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import Logs from "../views/Logs.vue";
import Main from "../views/Main.vue";
import Repo from "../views/Repo.vue";
import Settings from "../views/Settings.vue";

export default new Router({
  mode: "history",
  base: "/",
  routes: [
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
    {
      path: "/:namespace/:name/:build/:stage/:step",
      name: "logs",
      component: Logs
    },
    {
      path: "/",
      component: Main,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: { requiresAuth: true }
        },
        {
          path: "/account",
          name: "account",
          component: Account,
          meta: { requiresAuth: true }
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
              path: "settings",
              name: "settings",
              component: Settings,
              meta: { requiresAuth: true }
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
  ]
});

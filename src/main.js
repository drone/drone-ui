import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import Index from './pages/index.vue'
import Repo from './pages/repository.vue'
import RepoBadges from './pages/repository_badges.vue'
import RepoSettings from './pages/repository_settings.vue'
import RepoHistory from './pages/repository_history.vue'
import Settings from './pages/settings.vue'
import Build from './pages/build.vue'
import BuildMatrix from './pages/build_matrix.vue'
import BuildResult from './pages/build_result.vue'
import Mdl from './components/mdl'

import App from './app.vue'

// install plugins
Vue.use(Router);
Vue.use(Resource);
Vue.use(Mdl);

// routing
var router = new Router({history: true});

router.map({
  '/settings': {
    name: 'settings',
    component: Settings
  },
  '/': {
    name: 'index',
    component: Index,
    subRoutes: {
      '/:owner/:name': {
        name: 'repo',
        component: Repo,
        subRoutes: {
          '/': {
            name: 'repoHistory',
            component: RepoHistory
          },
          '/badges': {
            name: 'repoBadges',
            component: RepoBadges
          },
          '/settings': {
            name: 'repoSettings',
            component: RepoSettings
          },
          '/:build': {
            name: 'build',
            component: Build,
            subRoutes: {
              '/': {
                name: 'buildMatrix',
                component: BuildMatrix
              },
              '/:job': {
                name: 'buildResult',
                component: BuildResult
              }
            }
          }
        }
      }
    }
  }
});

router.beforeEach(function () {
  window.scrollTo(0, 0)
});

router.start(App, "#app");
//
// new Vue({
//   el: 'body',
//   components: { App }
// })

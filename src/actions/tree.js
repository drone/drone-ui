import Baobab from 'baobab';

// loads the user from the server state.
const user = window.STATE_FROM_SERVER && window.STATE_FROM_SERVER.user;

// loads the window location from the browser.
const location = window && window.location;

// tree stores the global state of the application.
export const tree = new Baobab({
  // the user branch of the tree maintains the currently authenticated user
  // information, sourced from the STATE_FROM_SERVER global variable.
  user: user,

  // the location branch of the tree maintains the browser location, sourced
  // from the window.location global variable.
  location: location,

  // the repos branch of the tree maintains an index of repository nodes
  // organized by repository owner and repository name. For example:
  //
  // {
  //   "octocat": {
  //     "hello-world": { ... },
  //     "spoon-knife": { ... },
  //   }
  // }
  //
  repos: {},

  // the build branch of the tree maintains an index of builds nodes organized
  // by repository owner, name, and build number. For example:
  //
  // {
  //   "octocat": {
  //     "hello-world": {
  //       "1": { number: 1, ... },
  //       "2": { number: 2, ... },
  //     }
  //   }
  // }
  //
  builds: {},

  // the feed branch of the tree maintains an activity feed array, consisting
  // of the latest activity per repository.
  feed: [],

  // the selected tree tracks the selected repository, build and job.
  // repo: undefined,
  // build: undefined,
  // job: undefined,

  // the pages branch of the tree maintains miscellanous state for the pages
  // in the application, including dialag state, snackbar state, etc.
  pages: {
    account: {
      token: false
    },
    repo: {
      filter: undefined
    },
    build: {
      follow: false
    },
    loading: false,
    toast: undefined
  }
});

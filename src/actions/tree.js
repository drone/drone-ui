import Baobab from 'baobab';

// loads the user from the server state.
const user = window.STATE_FROM_SERVER && window.STATE_FROM_SERVER.user;

// tree stores the global state of the application.
export const tree = new Baobab({
  // the user branch of the tree maintains the currently authenticated user
  // information, sourced from the STATE_FROM_SERVER global variable.
  user: user,

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

  // the secrets branch of the tree maintains the current secrets for the repository owner/name

  secrets: {},

  // the build branch of the tree maintains an unfiltered index of builds nodes 
  // organized by repository owner, name, and build number. For example:
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

  // the filtered_builds branch of the tree maintains a filtered index of builds nodes
  // organized by repository owner, name and build number. Only nodes which meet filter
  // criteria are included.
  filtered_builds: {},

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
      token: false,
      syncing: false
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

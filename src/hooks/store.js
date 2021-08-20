import { axiosWrapper } from 'utils';

import create from 'zustand';

export const useStore = create((set, get) => ({
  cache: {},
  repos: undefined,
  error: undefined,
  fired: false,

  update: (repo) => {
    const repos = get().repos;
    if (repos && repos[repo.slug]) {
      console.log('update', repo.slug, repo.status);
      set(state => {
        state.repos[repo.slug] = repo;
      });
    }
  },

  reload: async () => {
    const repos = await axiosWrapper(`/api/user/repos?latest=true`, { method: 'GET' });
    set((state => {
      state.repos = createSet(repos);
      state.error = undefined;
    }));
  },

  reloadOnce: async () => {
    // exit early if the request for the repository
    // list has already been fired.
    if (get().fired) {
      return;
    }

    // update the state of the store to indicate the
    // request to fetch repositorie has been fired,
    // which prevents subsequent calls.
    set((state => state.fired = true));

    const repos = await axiosWrapper(`/api/user/repos?latest=true`, { method: 'GET' });
    set((state => {
      state.repos = createSet(repos);
      state.error = undefined;
    }));
  },
}));

// helper function converts an array of repositories to a
// key value pair, where the key is the repository slug.
const createSet = (input) => {
  let output = {};
  input.forEach(repo => output[repo.slug] = repo);
  return output;
}

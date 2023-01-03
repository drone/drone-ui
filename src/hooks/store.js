import create from 'zustand';

import { axiosWrapper } from 'utils';

// helper function that returns an object of unique repos and unique orgs
const createSet = (input) => {
  const repos = {};
  const orgs = new Set();
  input.forEach((repo) => {
    repos[repo.slug] = repo;
    orgs.add(repo.namespace);
  });
  return { repos, orgs: [...orgs] };
};

export const useStore = create((set, get) => ({
  cache: {},
  repos: undefined,
  orgs: undefined,
  error: undefined,
  fired: false,

  update: (repo) => {
    const { repos } = get();
    if (repos && repos[repo.slug]) {
      const newRepos = repos;
      newRepos[repo.slug] = repo;
      set((state) => ({
        repos: newRepos,
        ...state,
      }));
    }
  },

  reload: async () => {
    const repos = await axiosWrapper('/api/user/repos?latest=true', {
      method: 'GET',
    });

    const { repos: repoSet, orgs } = createSet(repos);

    set((state) => ({
      ...state,
      repos: repoSet,
      orgs,
      error: undefined,
    }));
  },

  reloadOnce: async () => {
    // exit early if the request for the repository
    // list has already been fired.
    if (get().fired) {
      return;
    }

    // update the state of the store to indicate the
    // request to fetch repository has been fired,
    // which prevents subsequent calls.
    set((state) => ({
      ...state,
      fired: true,
    }));

    const repos = await axiosWrapper('/api/user/repos?latest=true', {
      method: 'GET',
    });

    const { repos: repoSet, orgs } = createSet(repos);

    set((state) => ({
      ...state,
      repos: repoSet,
      orgs,
      error: undefined,
    }));
  },
}));

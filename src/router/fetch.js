const ROUTES_WITH_TOGGLE_BEHAVIOUR = ["search", "builds-feed"];

/**
 * Returns a router gate that dispatches http requests
 * to fetch data based on the requested route.
 *
 * @param {*} store
 */
export const fetcher = ({ dispatch, commit }) => (to, from, next) => {
  const { name, params } = to;

  // TODO we should be able attach actions to the route
  // metadata so that we can dynamically dispatch.

  switch (name) {
    case "branches":
    case "deployments":
    case "build":
    case "builds":
    case "repo":
    case "badges":
    case "settings":
    case "step":
      dispatch("fetchRepo", params);
      break;
  }

  switch (name) {
    case "step":
    case "build":
      dispatch("fetchBuild", params);
      dispatch("fetchDeployments", params);
      break;
    case "builds":
      dispatch("fetchBuilds", { ...params, page: 1 });
      break;
    case "branches":
      // TODO: update to fetch builds by branch
      dispatch("fetchBranches", params);
      break;
    case "deployments":
      // TODO: update to fetch builds by deployments
      dispatch("fetchDeployments", params);
      break;
    case "home":
      dispatch("fetchReposLatest", params);
      break;
    case "settings":
      dispatch("fetchSecrets", params);
      dispatch("fetchCrons", params);
      break;
  }

  if (ROUTES_WITH_TOGGLE_BEHAVIOUR.includes(name) && !ROUTES_WITH_TOGGLE_BEHAVIOUR.includes(from.name)) {
    commit("SAVE_FROM_ROUTE", from);
  }

  next();
};

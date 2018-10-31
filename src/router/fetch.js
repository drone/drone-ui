/**
 * Returns a router gate that dispatches http requests
 * to fetch data based on the requested route.
 * 
 * @param {*} store
 */
export const fetcher = ({dispatch}) => (to, from, next) => {
    const {name, params} = to;

    // TODO we should be able attach actions to the route
    // metadata so that we can dynamically dispatch.

    switch (name) {
    case "build":
    case "builds":
    case "cron":
    case "logs":
    case "repo":
    case "secrets":
    case "settings":
      dispatch('fetchRepo', params);   
      break
    }
  
    switch (name) {
    case "account":
      dispatch('fetchViewerToken', params);
      break
    case "build":
      dispatch('fetchBuild', params);
      break;
    case "builds":
      dispatch('fetchBuilds', params);
      break
    case "home":
      dispatch('fetchReposLatest', params);
      break;
    case "logs":
      dispatch('fetchBuild', params);
      break;
    case "settings":
      dispatch('fetchSecrets', params);
      dispatch('fetchCrons', params);
    }
  
    next();
}

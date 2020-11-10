import { instance, headers, token } from "./config";
import { byBuildCreatedAtDesc } from "@/lib/reposSort";
import { dispatchTypicalFetch } from "./_base";
import { isBuildFinished } from "@/lib/buildHelper";

/**
 * fetchBuilds fetches the build list and dispatches an
 * event to update the store.
 */
export const fetchBuilds = (store, params) => {
  const { namespace, name, page = 1 } = params;

  return dispatchTypicalFetch(store, params, "BUILD_LIST", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds?page=${page}`, {
      headers,
      credentials: "same-origin"
    });
  });
};

/**
 * fetchBranches fetches the build list and dispatches an
 * event to update the store.
 */
export const fetchBranches = (store, params) => {
  const { namespace, name } = params;

  return dispatchTypicalFetch(store, params, "BRANCH_LIST", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds/branches`, {
      headers,
      credentials: "same-origin"
    });
  });
};

/**
 * fetchDeployments fetches the build list and dispatches an
 * event to update the store.
 */
export const fetchDeployments = (store, params) => {
  const { namespace, name } = params;

  return dispatchTypicalFetch(store, params, "DEPLOYMENT_LIST", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds/deployments`, {
      headers,
      credentials: "same-origin"
    });
  });
};

/**
 * fetchBuild fetches the build and dispatches an event
 * to update the store.
 */
export const fetchBuild = async (store, params) => {
  const { namespace, name, build } = params;

  return dispatchTypicalFetch(store, params, "BUILD_FIND", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, { headers, credentials: "same-origin" });
  });
};

export const BUILD_CANCEL_LOADING = "BUILD_CANCEL_LOADING";
export const BUILD_CANCEL_SUCCESS = "BUILD_CANCEL_SUCCESS";
export const BUILD_CANCEL_FAILURE = "BUILD_CANCEL_FAILURE";

/**
 * cancelBuild cancels the build and dispatches an event
 * to purge the object from the store.
 */
export const cancelBuild = async ({ commit }, { namespace, name, build }) => {
  commit(BUILD_CANCEL_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, {
    headers,
    method: "DELETE",
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    commit(BUILD_CANCEL_SUCCESS, { namespace, name, build: res });
  } else {
    commit(BUILD_CANCEL_FAILURE, { namespace, name, error: res });
  }
};

export const BUILD_RETRY_LOADING = "BUILD_RETRY_LOADING";
export const BUILD_RETRY_SUCCESS = "BUILD_RETRY_SUCCESS";
export const BUILD_RETRY_FAILURE = "BUILD_RETRY_FAILURE";

/**
 * createBuild spawns the a new build from an existing entry
 * and dispatches an event to add the object to the store.
 */
export const createBuild = async ({ commit }, { namespace, name, build }) => {
  commit(BUILD_RETRY_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, {
    headers,
    method: "POST",
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    const data = { namespace, name, build: res };
    commit(BUILD_RETRY_SUCCESS, data);
    return data;
  } else {
    commit(BUILD_RETRY_FAILURE, { namespace, name, error: res });
  }
};

/**
 * debugBuild spawns the a new build from an existing entry
 * and dispatches an event to add the object to the store.
 */
export const debugBuild = async ({ commit }, { namespace, name, build }) => {
  commit(BUILD_RETRY_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}?debug=true`, {
    headers,
    method: "POST",
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    const data = { namespace, name, build: res };
    commit(BUILD_RETRY_SUCCESS, data);
    return data;
  } else {
    commit(BUILD_RETRY_FAILURE, { namespace, name, error: res });
  }
};

/**
 * createDeployment spawns the a new build from an existing entry
 * and dispatches an event to add the object to the store.
 */
export const createDeployment = async ({ commit }, { namespace, name, build, target, action, params }) => {
  commit(BUILD_RETRY_LOADING);

  const query = {target, ...params};
  const encode = encodeURIComponent;
  const queryString = Object.keys(query).map(key => encode(key) + '=' + encode(query[key])).join('&');
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}/${action}?${queryString}`, {
    headers,
    method: "POST",
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    const data = { namespace, name, build: res };
    commit(BUILD_RETRY_SUCCESS, data);
    return data;
  } else {
    commit(BUILD_RETRY_FAILURE, { namespace, name, error: res });
  }
};

export const approveBuild = async (store, params) => {
  const { namespace, name, build, stage } = params;

  return dispatchTypicalFetch(store, params, "BUILD_APPROVE", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}/approve/${stage}`, {
      headers,
      method: "POST",
      credentials: "same-origin"
    });
  }).then(() => store.dispatch("fetchBuild", params));
};

export const declineBuild = async (store, params) => {
  const { namespace, name, build, stage } = params;

  return dispatchTypicalFetch(store, params, "BUILD_DECLINE", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}/decline/${stage}`, {
      headers,
      method: "POST",
      credentials: "same-origin"
    });
  }).then(() => store.dispatch("fetchBuild", params));
};

export const fetchBuildsFeed = async ({ commit }) => {
  commit("BUILDS_FEED_LOADING");

  const req = await fetch(`${instance}/api/user/builds/recent`, { headers, credentials: "same-origin" });
  const res = await req.json();

  if (req.status < 300) {
    const builds = res.filter(x => !isBuildFinished(x.build)).sort(byBuildCreatedAtDesc);
    commit("BUILDS_FEED_SUCCESS", { builds });
  } else {
    commit("BUILDS_FEED_FAILURE", { error: res });
  }
};

export const streamEvents = ({ commit, state, getters }) => {
  const path = `${instance}/api/stream${token ? `?access_token=${token}` : ""}`;
  const events = new EventSource(path);

  events.onmessage = function(event) {
    const repo = JSON.parse(event.data);

    if (window && window.DEBUG) {
      console.debug(repo);
    }

    commit("BUILD_EVENT", { repo });
  };
};

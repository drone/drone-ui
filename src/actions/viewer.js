import { instance, headers } from "./config";
import { dispatchTypicalFetch } from "./_base";

export const VIEWER_FIND_LOADING = "VIEWER_FIND_LOADING";
export const VIEWER_FIND_SUCCESS = "VIEWER_FIND_SUCCESS";
export const VIEWER_FIND_FAILURE = "VIEWER_FIND_FAILURE";

/**
 * fetchViewer fetches the currently authenticated user
 * and dispatches an event to update the store.
 */
export const fetchViewer = async context => {
  context.commit(VIEWER_FIND_LOADING);

  const req = await fetch(`${instance}/api/user`, { headers, credentials: "same-origin" });
  const res = await req.json();

  if (req.status > 299) {
    context.commit(VIEWER_FIND_FAILURE, { error: res });
  } else {
    context.commit(VIEWER_FIND_SUCCESS, { res });

    // TODO(bradrydzewski) find a way to decouple the
    // syncing from fetching the user.
    //
    // if the user is syncing we need to poll and
    // refresh the repository list when the syncing
    // is completed.
    if (res.syncing) {
      setTimeout(() => {
        context.dispatch("syncPoll");
      }, 10000);
    }
  }
};

/**
 * fetchViewer fetches the currently authenticated user
 * and dispatches an event to update the store.
 */
export const fetchViewerToken = store => {
  return dispatchTypicalFetch(store, null, "VIEWER_FIND_TOKEN", () => {
    return fetch(`${instance}/api/user/token`, { headers, method: "POST", credentials: "same-origin" });
  });
};

//
// TODO(bradrydzewski) we should use EventSource to poll
// the system for updates. This is going to be more efficent
// than multi-request polling with backoff.
//

export const VIEWER_SYNC_STARTING = "VIEWER_SYNC_STARTING";
export const VIEWER_SYNC_SUCCESS = "VIEWER_SYNC_SUCCESS";
export const VIEWER_SYNC_FAILURE = "VIEWER_SYNC_FAILURE";

export const syncAccount = async context => {
  context.commit(VIEWER_SYNC_STARTING);
  let req = null;

  try {
    req = await fetch(`${instance}/api/user/repos?async=true`, { headers, method: "POST", credentials: "same-origin" });
  } catch (e) {
    context.commit(VIEWER_SYNC_FAILURE, e);
    return;
  }

  if (req.status > 299) {
    const res = await req.json();
    context.commit(VIEWER_SYNC_FAILURE, res);
  }

  // once synchronization begins we should wait a few
  // seconds before we check if polling is complete.
  setTimeout(() => {
    context.dispatch("syncPoll");
  }, 10000);
};

export const syncPoll = async context => {
  const TIMEOUT = 10000; // 10 seconds

  let interval = setInterval(async function() {
    const req = await fetch(`${instance}/api/user`, { headers, credentials: "same-origin" });
    const res = await req.json();

    if (req.status > 299) {
      clearInterval(interval);
      context.commit(VIEWER_SYNC_FAILURE, res);
    } else if (res.syncing === false) {
      clearInterval(interval);
      context.commit(VIEWER_SYNC_SUCCESS, res);
      context.dispatch("fetchReposLatest");
    }
  }, TIMEOUT);
};

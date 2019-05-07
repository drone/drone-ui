import { instance, headers } from "./config";

export const CRON_LIST_LOADING = "CRON_LIST_LOADING";
export const CRON_LIST_SUCCESS = "CRON_LIST_SUCCESS";
export const CRON_LIST_FAILURE = "CRON_LIST_FAILURE";

/**
 * fetchCrons fetches the cron list and dispatches an
 * event to update the store.
 */
export const fetchCrons = async ({ commit }, { namespace, name }) => {
  commit(CRON_LIST_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, { headers, credentials: "same-origin" });
  const res = await req.json();

  if (req.status > 299) {
    commit(CRON_LIST_FAILURE, { namespace, name, error: res });
  } else {
    commit(CRON_LIST_SUCCESS, { namespace, name, secrets: res });
  }
};

export const CRON_FIND_LOADING = "CRON_FIND_LOADING";
export const CRON_FIND_SUCCESS = "CRON_FIND_SUCCESS";
export const CRON_FIND_FAILURE = "CRON_FIND_FAILURE";

/**
 * fetchCron fetches the cron job and dispatches an event
 * to update the store.
 */
export const fetchCron = async ({ commit }, state) => {
  commit(CRON_FIND_LOADING);

  const { namespace, name, cron } = state.route.params;
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron/${cron}`, {
    headers,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    commit(CRON_FIND_FAILURE, res);
  } else {
    commit(CRON_FIND_SUCCESS, res);
  }
};

export const CRON_DELETE_LOADING = "CRON_DELETE_LOADING";
export const CRON_DELETE_SUCCESS = "CRON_DELETE_SUCCESS";
export const CRON_DELETE_FAILURE = "CRON_DELETE_FAILURE";

/**
 * deleteCron deletes the cron job and dispatches an event
 * to purge the object from the store.
 */
export const deleteCron = async ({ commit }, { namespace, name, cron }) => {
  commit(CRON_DELETE_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron/${cron.name}`, {
    headers,
    method: "DELETE",
    credentials: "same-origin"
  });

  if (req.status < 300) {
    commit(CRON_DELETE_SUCCESS, { namespace, name, cron });
  } else {
    const res = await req.json();
    commit(CRON_DELETE_FAILURE, { namespace, name, error: res });
    throw new Error(res.message);
  }
};

export const CRON_CREATE_LOADING = "CRON_CREATE_LOADING";
export const CRON_CREATE_SUCCESS = "CRON_CREATE_SUCCESS";
export const CRON_CREATE_FAILURE = "CRON_CREATE_FAILURE";

/**
 * createCron creates the cron job and dispatches an event
 * to purge the object from the store.
 */
export const createCron = async ({ commit }, { namespace, name, cron }) => {
  commit(CRON_CREATE_LOADING);

  const body = JSON.stringify(cron);
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, {
    headers,
    method: "POST",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    commit(CRON_CREATE_FAILURE, { namespace, name, error: res });
    throw new Error(res.message);
  } else {
    commit(CRON_CREATE_SUCCESS, { namespace, name, cron: res });
  }
};

export const CRON_UPDATE_LOADING = "CRON_UPDATE_LOADING";
export const CRON_UPDATE_SUCCESS = "CRON_UPDATE_SUCCESS";
export const CRON_UPDATE_FAILURE = "CRON_UPDATE_FAILURE";

/**
 * updateCron updates the cron job and dispatches an event
 * to purge the object from the store.
 */
export const updateCron = async (dispatch, state, input) => {
  dispatch({
    type: CRON_UPDATE_LOADING
  });

  const { namespace, name } = state.route.params;
  const body = JSON.stringify(input);
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron/${input.name}`, {
    headers,
    method: "PATCH",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    dispatch({
      type: CRON_UPDATE_SUCCESS,
      data: res
    });
  } else {
    dispatch({
      type: CRON_UPDATE_FAILURE,
      error: res
    });
  }
};

import { instance, headers } from "./config";
import { dispatchTypicalFetch } from "./_base";

/**
 * fetchSecrets fetches the secret list and dispatches an
 * event to update the store.
 */
export const fetchSecrets = (store, params) => {
  const { namespace, name } = params;

  return dispatchTypicalFetch(store, params, "SECRET_LIST", () => {
    return fetch(`${instance}/api/repos/${namespace}/${name}/secrets`, { headers, credentials: "same-origin" });
  });
};

export const SECRET_FIND_LOADING = "SECRET_FIND_LOADING";
export const SECRET_FIND_SUCCESS = "SECRET_FIND_SUCCESS";
export const SECRET_FIND_FAILURE = "SECRET_FIND_FAILURE";

/**
 * fetchSecret fetches the secret and dispatches an event
 * to update the store.
 */
export const fetchSecret = async ({ commit }, { namespace, name, secret }) => {
  commit(SECRET_FIND_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/secrets/${secret}`, {
    headers,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    commit(SECRET_FIND_FAILURE, { namespace, name, error: res });
  } else {
    commit(SECRET_FIND_SUCCESS, { namespace, name, secret: res });
  }
};

export const SECRET_DELETE_LOADING = "SECRET_DELETE_LOADING";
export const SECRET_DELETE_SUCCESS = "SECRET_DELETE_SUCCESS";
export const SECRET_DELETE_FAILURE = "SECRET_DELETE_FAILURE";

/**
 * deleteSecret deletes the secret and dispatches an event
 * to purge the object from the store.
 */
export const deleteSecret = async ({ commit }, { namespace, name, secret }) => {
  commit(SECRET_DELETE_LOADING);

  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/secrets/${secret.name}`, {
    headers,
    method: "DELETE",
    credentials: "same-origin"
  });

  if (req.status < 300) {
    commit(SECRET_DELETE_SUCCESS, { namespace, name, secret });
  } else {
    const res = await req.json();
    commit(SECRET_DELETE_FAILURE, { namespace, name, error: res });
    throw new Error(res.message);
  }
};

export const SECRET_CREATE_LOADING = "SECRET_CREATE_LOADING";
export const SECRET_CREATE_SUCCESS = "SECRET_CREATE_SUCCESS";
export const SECRET_CREATE_FAILURE = "SECRET_CREATE_FAILURE";

/**
 * createSecret creates the secret and dispatches an event
 * to purge the object from the store.
 */
export const createSecret = async ({ commit }, { namespace, name, secret }) => {
  commit(SECRET_CREATE_LOADING);

  const body = JSON.stringify(secret);
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/secrets`, {
    headers,
    method: "POST",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    commit(SECRET_CREATE_FAILURE, { namespace, name, error: res });
    throw new Error(res.message);
  } else {
    commit(SECRET_CREATE_SUCCESS, { namespace, name, secret: res });
  }
};

export const SECRET_UPDATE_LOADING = "SECRET_UPDATE_LOADING";
export const SECRET_UPDATE_SUCCESS = "SECRET_UPDATE_SUCCESS";
export const SECRET_UPDATE_FAILURE = "SECRET_UPDATE_FAILURE";

/**
 * updateSecret updates the secret and dispatches an event
 * to purge the object from the store.
 */
export const updateSecret = async (dispatch, state, input) => {
  dispatch({
    type: SECRET_UPDATE_LOADING
  });

  const { namespace, name } = state.route.params;
  const body = JSON.stringify(input);
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/secrets/${input.name}`, {
    headers,
    method: "PATCH",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    dispatch({
      type: SECRET_UPDATE_SUCCESS,
      data: res
    });
  } else {
    dispatch({
      type: SECRET_UPDATE_FAILURE,
      error: res
    });
  }
};

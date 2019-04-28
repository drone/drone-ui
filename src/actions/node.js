import { instance, headers } from "./config";

export const NODE_LIST_LOADING = "NODE_LIST_LOADING";
export const NODE_LIST_SUCCESS = "NODE_LIST_SUCCESS";
export const NODE_LIST_FAILURE = "NODE_LIST_FAILURE";

/**
 * fetchNodes fetches the node list and dispatches an
 * event to update the store.
 */
export const fetchNodes = async store => {
  store.commit(NODE_LIST_LOADING);

  const req = await fetch(`${instance}/api/nodes`, { headers, credentials: "same-origin" });
  const res = await req.json();

  if (req.status > 299) {
    store.commit(NODE_LIST_FAILURE, res);
  } else {
    store.commit(NODE_LIST_SUCCESS, res);
  }
};

export const NODE_FIND_LOADING = "NODE_FIND_LOADING";
export const NODE_FIND_SUCCESS = "NODE_FIND_SUCCESS";
export const NODE_FIND_FAILURE = "NODE_FIND_FAILURE";

/**
 * fetchNode fetches the node and dispatches an event
 * to update the store.
 */
export const fetchNode = async ({ commit }, { name }) => {
  commit(NODE_FIND_LOADING);

  const req = await fetch(`${instance}/api/nodes/${name}`, { headers, credentials: "same-origin" });
  const res = await req.json();

  if (req.status > 299) {
    commit(NODE_FIND_FAILURE, res);
  } else {
    commit(NODE_FIND_SUCCESS, res);
  }
};

export const NODE_UPDATE_LOADING = "NODE_UPDATE_LOADING";
export const NODE_UPDATE_SUCCESS = "NODE_UPDATE_SUCCESS";
export const NODE_UPDATE_FAILURE = "NODE_UPDATE_FAILURE";

/**
 * updateNode updates the node and dispatches an event
 * to update the object in the store.
 */
export const updateNode = async ({ commit }, input) => {
  commit(NODE_UPDATE_LOADING);

  const body = JSON.stringify(input);
  const req = await fetch(`${instance}/api/nodes/${input.name}`, {
    headers,
    method: "PATCH",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.ok) {
    commit(NODE_UPDATE_SUCCESS, { name, node: res });
  } else {
    const error = { ...res, status: req.status };
    commit(NODE_UPDATE_FAILURE, { name, error });
  }
};

export const NODE_DELETE_LOADING = "NODE_DELETE_LOADING";
export const NODE_DELETE_SUCCESS = "NODE_DELETE_SUCCESS";
export const NODE_DELETE_FAILURE = "NODE_DELETE_FAILURE";

/**
 * deleteNode delete the node and dispatches an event
 * to remove the object from the store.
 */
export const deleteNode = async ({ commit }, node) => {
  commit(NODE_DELETE_LOADING);

  const req = await fetch(`${instance}/api/nodes/${node.name}`, {
    headers,
    method: "DELETE",
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.ok) {
    commit(NODE_DELETE_SUCCESS, { node });
  } else {
    const error = { ...res, status: req.status };
    commit(NODE_DELETE_FAILURE, { node, error });
  }
};

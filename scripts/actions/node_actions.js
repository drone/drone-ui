export const NODE_LIST_REQUEST = "NODE_LIST_REQUEST";
export const NODE_LIST_SUCCESS = "NODE_LIST_SUCCESS";
export const NODE_LIST_FAILURE = "REPO_LIST_FAILURE";

export function requestNodeList() {
  return { type: NODE_LIST_REQUEST }
}

export function receiveNodeList(data) {
  return { type: NODE_LIST_SUCCESS, nodes: data }
}

export function fetchNodeList() {
  return dispatch => {
    dispatch(requestNodeList());

    return fetch("/api/nodes")
      .then(response => response.json())
      .then(json => dispatch(receiveNodeList(json)));
  }
}
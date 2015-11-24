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

    return fetch("/api/nodes", {credentials: "same-origin"})
      .then(response => response.json())
      .then(json => dispatch(receiveNodeList(json)));
  }
}

export const NODE_CREATE_REQUEST = "NODE_CREATE_REQUEST";
export const NODE_CREATE_SUCCESS = "NODE_CREATE_SUCCESS";
export const NODE_CREATE_FAILURE = "NODE_CREATE_FAILURE";

export function requestPostNode() {
  return { type: NODE_CREATE_REQUEST }
}

export function receivePostNode(node) {
  return { type: NODE_CREATE_SUCCESS, node }
}

export function receivePostNodeError(node, error) {
  return { type: NODE_CREATE_FAILURE, node, error }
}

export function postNode(node) {
  return dispatch => {
    dispatch(requestPostNode());

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
    const body = JSON.stringify(node);

    var processStatus = function (response) {
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    };

    return fetch("/api/nodes", {method: "POST", credentials: "same-origin", body, headers})
      .then(processStatus)
      .then(resp => resp.json())
      .then(json => dispatch(receivePostNode(json)))
      .catch(resp => {
        resp.text().then(text => {
          dispatch(receivePostNodeError(node, text))
        });
      });
  }
}


export const NODE_DELETE_REQUEST = "NODE_DELETE_REQUEST";
export const NODE_DELETE_SUCCESS = "NODE_DELETE_SUCCESS";
export const NODE_DELETE_FAILURE = "NODE_DELETE_FAILURE";

export function requestDeleteNode(node) {
  return { type: NODE_DELETE_REQUEST, node }
}

export function receiveDeleteNode(node) {
  return { type: NODE_DELETE_SUCCESS, node }
}

export function receiveDeleteNodeError(node, error) {
  return { type: NODE_DELETE_FAILURE, node, error }
}

export function deleteNode(node) {
  return dispatch => {
    dispatch(requestDeleteNode(node));

    return fetch(`/api/nodes/${node.id}`, {method: "DELETE", credentials: "same-origin"})
      .then(response => dispatch(receiveDeleteNode(node)));
  }
}

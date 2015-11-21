export const USER_LIST_REQUEST = "USER_LIST_REQUEST";
export const USER_LIST_SUCCESS = "USER_LIST_SUCCESS";
export const USER_LIST_FAILURE = "USER_LIST_FAILURE";

export function requestUserList() {
  return { type: USER_LIST_REQUEST }
}

export function receiveUserList(data) {
  return { type: USER_LIST_SUCCESS, users: data }
}

export function fetchUserList() {
  return dispatch => {
    dispatch(requestUserList());

    return fetch("/api/users")
      .then(response => response.json())
      .then(json => dispatch(receiveUserList(json)));
  }
}

export const USER_TOKEN_REQUEST = "USER_TOKEN_REQUEST";
export const USER_TOKEN_SUCCESS = "USER_TOKEN_SUCCESS";
export const USER_TOKEN_FAILURE = "USER_TOKEN_FAILURE";

export function requestUserToken() {
  return { type: USER_TOKEN_REQUEST }
}

export function receiveUserToken(data) {
  return { type: USER_TOKEN_SUCCESS, token: data }
}

export function fetchUserToken() {
  return dispatch => {
    dispatch(requestUserToken());

    return fetch("/api/user/token", {method: "POST"})
      .then(response => response.text())
      .then(text => dispatch(receiveUserToken(text)));
  }
}

export const USER_CREATE_REQUEST = "USER_CREATE_REQUEST";
export const USER_CREATE_SUCCESS = "USER_CREATE_SUCCESS";
export const USER_CREATE_FAILURE = "USER_CREATE_FAILURE";

export function requestPostUser() {
  return { type: USER_CREATE_REQUEST }
}

export function receivePostUser(user) {
  return { type: USER_CREATE_SUCCESS, user }
}

export function receivePostUserError(error) {
  return { type: USER_CREATE_FAILURE, error }
}

export function postUser(user) {
  return dispatch => {
    dispatch(requestPostUser());

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
    const body = JSON.stringify(user);

    return fetch("/api/users", {method: "POST", body, headers})
      .then((response) => {
        if (response.status < 300) {
          return response.json();
        }
        throw response;
      })
      .then(json => dispatch(receivePostUser(json)))
      .catch(response => response.text())
      .then(err => dispatch(receivePostUserError(err)));
  }
}



export const USER_UPDATE_REQUEST = "USER_UPDATE_REQUEST";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAILURE = "USER_UPDATE_FAILURE";

export function requestPatchUser() {
  return { type: USER_UPDATE_REQUEST }
}

export function receivePatchUser(user) {
  return { type: USER_UPDATE_SUCCESS, user }
}

export function receivePatchUserError(error) {
  return { type: USER_UPDATE_FAILURE, error }
}

export function patchUser(user) {
  return dispatch => {
    dispatch(requestPostUser());

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
    const body = JSON.stringify(user);

    return fetch(`/api/users/${user.login}`, {method: "PATCH", body, headers})
      .then(response => response.json())
      .then(json => dispatch(receivePatchUser(json)));
  }
}


export const USER_DELETE_REQUEST = "USER_DELETE_REQUEST";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";
export const USER_DELETE_FAILURE = "USER_DELETE_FAILURE";

export function requestDeleteUser(user) {
  return { type: USER_DELETE_REQUEST, user }
}

export function receiveDeleteUser(user) {
  return { type: USER_DELETE_SUCCESS, user }
}

export function receiveDeleteUserError(error) {
  return { type: USER_DELETE_FAILURE, error }
}

export function deleteUser(user) {
  return dispatch => {
    dispatch(requestDeleteUser());

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
    const body = JSON.stringify(user);

    return fetch(`/api/users/${user.login}`, {method: "DELETE", headers})
      .then(response => dispatch(receiveDeleteUser(user)));
  }
}

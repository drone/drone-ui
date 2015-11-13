import fetch from "isomorphic-fetch";
// import { debounce } from "lodash";

//
// User Actions
//

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

// Fetches a single user from Github API.
export function fetchUser(login) {
  return { type: USER_REQUEST, login }
}

//
// Repo Actions
//

export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
export const REPO_FAILURE = 'REPO_FAILURE'

// Triggers an Action upon requesting a repoistory
// from the server.
export function requestRepo(owner, name) {
  return { type: REPO_REQUEST, owner, name }
}

// Triggers an Action upon successfully loading a
// repoistory from the server.
export function receiveRepo(json) {
  return {
  	type: REPO_SUCCESS,
  	repo: json
  }
}

// Fetches a single repo from Drone.
export function fetchRepo(owner, name) {
  return dispatch => {
    dispatch(requestRepo(owner, name));

    return fetch(`/api/repos/${owner}/${name}`)
      .then(response => response.json())
      .then(json => dispatch(receiveRepo(json)));
  }
}


export const REPO_PATCH_REQUEST = 'REPO_PATCH_REQUEST'
export const REPO_PATCH_SUCCESS = 'REPO_PATCH_SUCCESS'
export const REPO_PATCH_FAILURE = 'REPO_PATCH_FAILURE'

export function requestPatchRepo(owner, name, attrs) {
  return { type: REPO_PATCH_REQUEST, owner, name, attrs }
}

export function receivePatchRepo(json) {
  return {
    type: REPO_PATCH_SUCCESS,
    repo: json
  }
}

export function patchRepo(owner, name, attrs) {
  return dispatch => {
    dispatch(requestPatchRepo(owner, name, attrs));

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
    const json = JSON.stringify(attrs);

    return fetch(`/api/repos/${owner}/${name}`, {method: "PATCH", body: json, headers: headers})
      .then(response => response.json())
      .then(json => dispatch(receivePatchRepo(json)));
  }
}

// the slider will fire off a bunch of events
// if we aren't careful, so we'll use the debounce
// as a workaround.
// export const patchRepoDebounce = debounce(patchRepo, 750, false);

//
// Key Actions
//

export const KEY_REQUEST = 'KEY_REQUEST'
export const KEY_SUCCESS = 'KEY_SUCCESS'
export const KEY_FAILURE = 'KEY_FAILURE'

export function requestRepoKey(owner, name) {
  return { type: KEY_REQUEST, owner, name }
}


export function receiveRepoKey(text) {
  return {
    type: KEY_SUCCESS,
    keys: {public: text}
  }
}

export function fetchRepoKey(owner, name) {
  return dispatch => {
    requestRepoKey(owner, name);

    return fetch(`/api/repos/${owner}/${name}/key`)
      .then(response => response.text())
      .then(text => dispatch(receiveRepoKey(text)));
  }
}

// function putRepo(login) {
//   return fetch("/data/out.txt", {method: "post"})
//     .then(response => response.json());
// }



//
// Repo List Actions
//

export const REPO_LIST_REQUEST = 'REPO_LIST_REQUEST'
export const REPO_LIST_SUCCESS = 'REPO_LIST_SUCCESS'
export const REPO_LIST_FAILURE = 'REPO_LIST_FAILURE'

export function requestRepoList() {
  return { type: REPO_LIST_REQUEST }
}

export function receiveRepoList(json) {
  return {
  	type: REPO_LIST_SUCCESS,
  	repos: json
  }
}

export function fetchRepoList() {
  return dispatch => {
    dispatch(requestRepoList());

    return fetch(`/api/user/repos/remote`)
      .then(response => response.json())
      .then(json => dispatch(receiveRepoList(json)));
  }
}

//
// Repo Actions
//

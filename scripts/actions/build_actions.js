export const BUILD_LIST_REQUEST = "BUILD_LIST_REQUEST";
export const BUILD_LIST_SUCCESS = "BUILD_LIST_SUCCESS";
export const BUILD_LIST_FAILURE = "BUILD_LIST_FAILURE";

export function requestBuildList(owner, name) {
  return { type: BUILD_LIST_REQUEST, owner, name }
}

export function receiveBuildList(owner, name, builds) {
  return { type: BUILD_LIST_SUCCESS, owner, name, builds }
}

export function fetchBuildList(owner, name) {
  return dispatch => {
    dispatch(requestBuildList(owner, name));

    return fetch(`/api/repos/${owner}/${name}/builds`, {credentials: "same-origin"})
      .then(response => response.json())
      .then(json => dispatch(receiveBuildList(owner, name, json)));
  }
}

export const BUILD_REQUEST = "BUILD_REQUEST";
export const BUILD_SUCCESS = "BUILD_SUCCESS";
export const BUILD_FAILURE = "BUILD_FAILURE";

export function requestBuild(owner, name, number) {
  return { type: BUILD_REQUEST, owner, name, number }
}

export function receiveBuild(owner, name, number, build) {
  return { type: BUILD_SUCCESS, owner, name, number, build }
}

export function fetchBuild(owner, name, number) {
  return dispatch => {
    dispatch(requestBuild(owner, name, number));

    return fetch(`/api/repos/${owner}/${name}/builds/${number}`, {credentials: "same-origin"})
      .then(response => response.json())
      .then(json => dispatch(receiveBuild(owner, name, number, json)));
  }
}

export const BUILD_RESTART_REQUEST = "BUILD_RESTART_REQUEST";
export const BUILD_RESTART_SUCCESS = "BUILD_RESTART_SUCCESS";
export const BUILD_RESTART_FAILURE = "BUILD_RESTART_FAILURE";

// export function startBuild(owner, name, build) {
//   return fetch("/data/out.txt", {method: "post"})
//     .then(response => response.json());
// }

// export function fetchBuildOutput(owner, name, build, job) {
//   return fetch("/data/out.txt")
//     .then(response => response.json());
// }



// export function stopBuild(owner, name, build) {
//   return fetch("/data/out.txt", {method: "delete"})
//     .then(response => response.json());
// }

export const JOB_CANCEL_REQUEST = "JOB_CANCEL_REQUEST";
export const JOB_CANCEL_SUCCESS = "JOB_CANCEL_SUCCESS";
export const JOB_CANCEL_FAILURE = "JOB_CANCEL_FAILURE";



export const LOG_REQUEST = "LOG_REQUEST";
export const LOG_SUCCESS = "LOG_SUCCESS";
export const LOG_FAILURE = "LOG_FAILURE";

export function requestLogs(owner, name, number, job) {
  return { type: LOG_REQUEST, owner, name, number, job }
}

export function receiveLogs(owner, name, number, job, logs) {
  return { type: LOG_SUCCESS, owner, name, number, job, logs }
}

export function fetchLogs(owner, name, number, job) {
  return dispatch => {
    dispatch(requestLogs(owner, name, number, job));

    return fetch(`/api/repos/${owner}/${name}/logs/${number}/${job}`, {credentials: "same-origin"})
      .then(response => response.text())
      .then(text => dispatch(receiveLogs(owner, name, number, job, text)));
  }
}

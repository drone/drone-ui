import throttle from "lodash.throttle";
import { instance, headers, token } from "./config";

export const LOGS_FIND_LOADING = "LOGS_FIND_LOADING";
export const LOGS_FIND_SUCCESS = "LOGS_FIND_SUCCESS";
export const LOGS_FIND_FAILURE = "LOGS_FIND_FAILURE";

/**
 * fetchLogs fetches the logs and dispatches an event
 * to update the store.
 */
export const fetchLogs = async ({ commit }, params) => {
  if (streamLogs.events) {
    streamLogs.events.close();
  }

  commit(LOGS_FIND_LOADING);

  const { namespace, name, build, stage, step } = params;
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}/logs/${stage}/${step}`, {
    headers,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    commit(LOGS_FIND_FAILURE, { ...params, error: { status: req.status, message: res.message } });
  } else {
    commit(LOGS_FIND_SUCCESS, { ...params, lines: res });
  }
};

export const LOG_WRITE = "LOG_WRITE";
export const LOG_CLEAR = "LOG_CLEAR";

export function streamLogs({ commit }, params) {
  if (streamLogs.events) {
    streamLogs.events.close();
  }

  const { namespace, name, build, stage, step } = params;
  let path = `${instance}/api/stream/${namespace}/${name}/${build}/${stage}/${step}`;
  path = !token ? path : `${path}?access_token=${token}`;

  commit(LOG_CLEAR);

  let lines = [];
  const throttledCommit = throttle(() => {
    commit(LOG_WRITE, { lines });
    lines = [];
  }, 500);

  streamLogs.events = new EventSource(path);
  streamLogs.events.onmessage = function(event) {
    lines.push(JSON.parse(event.data));
    throttledCommit();
  };
  streamLogs.events.onerror = function(err) {
    if (err.data === "eof") {
      streamLogs.events.close();
    }
  };
}

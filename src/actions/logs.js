import {instance, headers} from "./config";

export const LOGS_FIND_LOADING = 'LOGS_FIND_LOADING';
export const LOGS_FIND_SUCCESS = 'LOGS_FIND_SUCCESS';
export const LOGS_FIND_FAILURE = 'LOGS_FIND_FAILURE';

/**
 * fetchLogs fetches the logs and dispatches an event
 * to update the store.
 */
export const fetchLogs = async ({commit}, params) => {
	commit(LOGS_FIND_LOADING);

	const {namespace, name, build, stage, step} = params;
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}/logs/${stage}/${step}`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		commit(LOGS_FIND_FAILURE, {...params, error: res});
	} else {
		commit(LOGS_FIND_SUCCESS, {...params, lines: res});
	}
}

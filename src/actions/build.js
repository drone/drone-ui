import {instance, headers} from "./config";

export const BUILD_LIST_LOADING = 'BUILD_LIST_LOADING';
export const BUILD_LIST_SUCCESS = 'BUILD_LIST_SUCCESS';
export const BUILD_LIST_FAILURE = 'BUILD_LIST_FAILURE';

/**
 * fetchBuilds fetches the build list and dispatches an
 * event to update the store.
 */
export const fetchBuilds = async ({commit}, params) => {
    commit(BUILD_LIST_LOADING);

	const {namespace, name} = params;
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
        commit(BUILD_LIST_FAILURE, {params, error: res});
	} else {
        commit(BUILD_LIST_SUCCESS, {params, builds: res});
	}
}


export const BUILD_FIND_LOADING = 'BUILD_FIND_LOADING';
export const BUILD_FIND_SUCCESS = 'BUILD_FIND_SUCCESS';
export const BUILD_FIND_FAILURE = 'BUILD_FIND_FAILURE';

/**
 * fetchBuild fetches the build and dispatches an event
 * to update the store.
 */
export const fetchBuild = async ({commit}, params) => {
	commit(BUILD_FIND_LOADING);

	const {namespace, name, build} = params;
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		commit(BUILD_FIND_FAILURE, {params, error: res});
	} else {
		commit(BUILD_FIND_SUCCESS, {params, build: res});
	}
}

export const BUILD_CANCEL_LOADING = 'BUILD_CANCEL_LOADING';
export const BUILD_CANCEL_SUCCESS = 'BUILD_CANCEL_SUCCESS';
export const BUILD_CANCEL_FAILURE = 'BUILD_CANCEL_FAILURE';

/**
 * cancelBuild cancels the build and dispatches an event
 * to purge the object from the store.
 */
export const cancelBuild = async ({commit}, {namespace, name, build}) => {
	commit(BUILD_CANCEL_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, {headers, method: 'DELETE', credentials: 'same-origin'});
    const res = await req.json();

	if (req.status < 300) {
        commit(BUILD_CANCEL_SUCCESS, {namespace, name, build: res});
	} else {
		commit(BUILD_CANCEL_FAILURE, {namespace, name, error: res});
    }
}

export const BUILD_RETRY_LOADING = 'BUILD_RETRY_LOADING';
export const BUILD_RETRY_SUCCESS = 'BUILD_RETRY_SUCCESS';
export const BUILD_RETRY_FAILURE = 'BUILD_RETRY_FAILURE';

/**
 * createBuild swapns the a new build from an existing entry
 * and dispatches an event to add the object to the store.
 */
export const createBuild = async ({commit}, {namespace, name, build}) => {
	commit(BUILD_RETRY_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/builds/${build}`, {headers, method: 'POST', credentials: 'same-origin'});
    const res = await req.json();

	if (req.status < 300) {
		const data = {namespace, name, build: res};
		commit(BUILD_RETRY_SUCCESS, data);
		return data
	} else {
		commit(BUILD_RETRY_FAILURE, {namespace, name, error: res});
    }
}

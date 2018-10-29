import {instance, headers} from "./config";

export const VIEWER_FIND_LOADING = 'VIEWER_FIND_LOADING';
export const VIEWER_FIND_SUCCESS = 'VIEWER_FIND_SUCCESS';
export const VIEWER_FIND_FAILURE = 'VIEWER_FIND_FAILURE';

/**
 * fetchViewer fetches the currently authenticated user
 * and dispatches an event to update the store.
 */
export const fetchViewer = async (context) => {
	context.commit(VIEWER_FIND_LOADING);

	const req = await fetch(`${instance}/api/user`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		context.commit(VIEWER_FIND_FAILURE, res);
	} else {
		context.commit(VIEWER_FIND_SUCCESS, res);
	}
}

export const VIEWER_FINE_TOKEN_LOADING = 'VIEWER_FINE_TOKEN_LOADING';
export const VIEWER_FIND_TOKEN_SUCCESS = 'VIEWER_FIND_TOKEN_SUCCESS';
export const VIEWER_FIND_TOKEN_FAILURE = 'VIEWER_FIND_TOKEN_FAILURE';

/**
 * fetchViewer fetches the currently authenticated user
 * and dispatches an event to update the store.
 */
export const fetchViewerToken = async (context) => {
	context.commit(VIEWER_FINE_TOKEN_LOADING);

	const req = await fetch(`${instance}/api/user/token`, {headers, method: 'POST', credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		context.commit(VIEWER_FIND_TOKEN_FAILURE, res);
	} else {
		context.commit(VIEWER_FIND_TOKEN_SUCCESS, res);
	}
}
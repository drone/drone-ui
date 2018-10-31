import {instance, headers} from "../../../actions/config";

import {
    CRON_LIST_LOADING,
    CRON_LIST_SUCCESS,
    CRON_LIST_FAILURE,
    CRON_DELETE_LOADING,
    CRON_DELETE_SUCCESS,
    CRON_DELETE_FAILURE,
    CRON_CREATE_LOADING,
    CRON_CREATE_SUCCESS,
    CRON_CREATE_FAILURE,
} from "./types";

/**
 * fetchCrons fetches the cron list and dispatches an
 * event to update the store.
 */
export const fetchCrons = async ({commit}, {namespace, name}) => {
	commit(CRON_LIST_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		commit(CRON_LIST_FAILURE, {namespace, name, error: res});
	} else {
		commit(CRON_LIST_SUCCESS,  {namespace, name, secrets: res});
	}
}

/**
 * deleteCron deletes the cron job and dispatches an event
 * to purge the object from the store.
 */
export const deleteCron = async ({commit}, {namespace, name, cron}) => {
	commit(CRON_DELETE_LOADING)

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron/${cron.name}`, {headers, method: 'DELETE', credentials: 'same-origin'});

	if (req.status < 300) {
        commit(CRON_DELETE_SUCCESS, {namespace, name, cron});
	} else {
        const res = await req.json();
        commit(CRON_DELETE_FAILURE, {namespace, name, error: res});
    }
}

/**
 * createCron creates the cron job and dispatches an event
 * to purge the object from the store.
 */
export const createCron = async ({commit}, {namespace, name, cron}) => {
	commit(CRON_CREATE_LOADING);

	const body = JSON.stringify(cron);
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/cron`, {headers, method: 'POST', body, credentials: 'same-origin'});
    const res = await req.json();

	if (req.status > 299) {
		commit(CRON_CREATE_FAILURE, {namespace, name, error: res});
	} else {
		commit(CRON_CREATE_SUCCESS, {namespace, name, cron: res});
	}
}

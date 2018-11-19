import {instance, headers} from "./config";

export const REPO_LIST_LOADING = 'REPO_LIST_LOADING';
export const REPO_LIST_SUCCESS = 'REPO_LIST_SUCCESS';
export const REPO_LIST_FAILURE = 'REPO_LIST_FAILURE';

/**
 * fetchRepos fetches the repository list and dispatches an
 * event to update the store.
 */
export const fetchRepos = async (store) => {
	store.commit(REPO_LIST_LOADING);

	const req = await fetch(`${instance}/api/user/repos`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		store.commit(REPO_LIST_FAILURE, res);
	} else {
		store.commit(REPO_LIST_SUCCESS, res);
	}
}

export const REPO_FIND_LOADING = 'REPO_FIND_LOADING';
export const REPO_FIND_SUCCESS = 'REPO_FIND_SUCCESS';
export const REPO_FIND_FAILURE = 'REPO_FIND_FAILURE';

/**
 * fetchRepo fetches the repository and dispatches an event
 * to update the store.
 */
export const fetchRepo = async ({commit, state}, params) => {
	commit(REPO_FIND_LOADING);

	const {namespace, name} = params;
	const req = await fetch(`${instance}/api/repos/${namespace}/${name}`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		commit(REPO_FIND_FAILURE, res);
	} else {
		commit(REPO_FIND_SUCCESS, res);
	}
}

export const REPO_LIST_LATEST_LOADING = 'REPO_LIST_LATEST_LOADING';
export const REPO_LIST_LATEST_SUCCESS = 'REPO_LIST_LATEST_SUCCESS';
export const REPO_LIST_LATEST_FAILURE = 'REPO_LIST_LATEST_FAILURE';

/**
 * fetchRepoLatest fetches the repository list with the
 * latest build results and dispatches an event to update
 * the store.
 */
export const fetchReposLatest = async (store) => {
	store.commit(REPO_LIST_LATEST_LOADING);

	const req = await fetch(`${instance}/api/user/repos?latest=true`, {headers, credentials: 'same-origin'});
	const res = await req.json();

	if (req.status > 299) {
		store.commit(REPO_LIST_LATEST_FAILURE, res);
	} else {
		store.commit(REPO_LIST_LATEST_SUCCESS, res);
	}
}

export const REPO_SYNC_LOADING = 'REPO_SYNC_LOADING';
export const REPO_SYNC_SUCCESS = 'REPO_SYNC_SUCCESS';
export const REPO_SYNC_FAILURE = 'REPO_SYNC_FAILURE';

/**
 * syncRepos submits a request to synchrnoize the repository
 * list, and dispatches an event to update the store.
 */
export const syncRepos = async (dispatch, store) => {
	store.commit(REPO_SYNC_LOADING);

	const req = await fetch(`${instance}/api/user/repos`, {headers, method: 'POST', credentials: 'same-origin'});

	if (req.status > 299) {
		const res = await req.json();
		store.commit(REPO_SYNC_FAILURE, res);
	} else {
		store.commit(REPO_SYNC_SUCCESS);
	}
}

export const REPO_ENABLE_LOADING = 'REPO_ENABLE_LOADING';
export const REPO_ENABLE_SUCCESS = 'REPO_ENABLE_SUCCESS';
export const REPO_ENABLE_FAILURE = 'REPO_ENABLE_FAILURE';

/**
 * enableRepo submits a request to enable the repository,
 * and dispatches an event to update the store.
 */
export const enableRepo = async ({commit}, {namespace, name}) => {
	commit(REPO_ENABLE_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}`, {headers, method: 'POST', credentials: 'same-origin'});
	const res = await req.json();

	if (req.ok) {
        commit(REPO_ENABLE_SUCCESS, {namespace, name, repo: res});
	} else {
		const error = {...res, status: req.status };
		commit(REPO_ENABLE_FAILURE, {namespace, name, error});
    }
}

export const REPO_DISABLE_LOADING = 'REPO_DISABLE_LOADING';
export const REPO_DISABLE_SUCCESS = 'REPO_DISABLE_SUCCESS';
export const REPO_DISABLE_FAILURE = 'REPO_DISABLE_FAILURE';

/**
 * disableRepo submits a request to disable the repository,
 * and dispatches an event to update the store.
 */
export const disableRepo = async ({commit}, {namespace, name}) => {
	commit(REPO_DISABLE_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}`, {headers, method: 'DELETE', credentials: 'same-origin'});
	const res = await req.json();

	if (req.status < 300) {
        commit(REPO_DISABLE_SUCCESS, {namespace, name, repo: res});
	} else {
		commit(REPO_DISABLE_FAILURE, {namespace, name, error: res});
    }
}


export const REPO_CHOWN_LOADING = 'REPO_CHOWN_LOADING';
export const REPO_CHOWN_SUCCESS = 'REPO_CHOWN_SUCCESS';
export const REPO_CHOWN_FAILURE = 'REPO_CHOWN_FAILURE';

/**
 * chownRepo submits a request to change repository ownership
 * to the currently authenticated user.
 */
export const chownRepo = async ({commit}, {namespace, name}) => {
	commit(REPO_CHOWN_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/chown`, {headers, method: 'POST', credentials: 'same-origin'});
	const res = await req.json();

	if (req.status < 300) {
        commit(REPO_CHOWN_SUCCESS);
	} else {
		commit(REPO_CHOWN_FAILURE, {namespace, name, error: res});
    }
}

export const REPO_REPAIR_LOADING = 'REPO_REPAIR_LOADING';
export const REPO_REPAIR_SUCCESS = 'REPO_REPAIR_SUCCESS';
export const REPO_REPAIR_FAILURE = 'REPO_REPAIR_FAILURE';

/**
 * repairRepo submits a request to repair the repository
 * webhook and sync repository metadata with the remote
 * system (e.g. GitHub).
 */
export const repairRepo = async ({commit}, {namespace, name}) => {
	commit(REPO_REPAIR_LOADING);

	const req = await fetch(`${instance}/api/repos/${namespace}/${name}/repair`, {headers, method: 'POST', credentials: 'same-origin'});
	const res = await req.json();

	if (req.status < 300) {
		commit(REPO_REPAIR_SUCCESS);
	} else {
		commit(REPO_REPAIR_FAILURE, {namespace, name, error: res});
    }
}

export const REPO_UPDATE_LOADING = 'REPO_UPDATE_LOADING';
export const REPO_UPDATE_SUCCESS = 'REPO_UPDATE_SUCCESS';
export const REPO_UPDATE_FAILURE = 'REPO_UPDATE_FAILURE';

/**
 * updateRepo updates the repository and dispatches an event
 * to purge the object from the store.
 */
export const updateRepo = async ({ commit }, { namespace, name, repo, onFailure }) => {
  commit(REPO_UPDATE_LOADING);

  const body = JSON.stringify(repo);
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}`, {
    headers,
    method: "PATCH",
    body,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status < 300) {
    commit(REPO_UPDATE_SUCCESS, { namespace, name, repo: res });
  } else {
    commit(REPO_UPDATE_FAILURE, { namespace, name, error: res });
    onFailure && onFailure(res);
  }
};

import { instance, headers } from "./config";

export const MEMBER_LIST_LOADING = "MEMBER_LIST_LOADING";
export const MEMBER_LIST_SUCCESS = "MEMBER_LIST_SUCCESS";
export const MEMBER_LIST_FAILURE = "MEMBER_LIST_FAILURE";

/**
 * fetchMembers fetches the list of repository members and
 * dispatches an event to update the store.
 */
export const fetchMembers = async (dispatch, state) => {
  dispatch({
    type: MEMBER_LIST_LOADING
  });

  const { namespace, name } = state.route.params;
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/collaborators`, {
    headers,
    credentials: "same-origin"
  });
  const res = await req.json();

  if (req.status > 299) {
    dispatch({
      type: MEMBER_LIST_FAILURE,
      error: res
    });
  } else {
    dispatch({
      type: MEMBER_LIST_SUCCESS,
      data: res
    });
  }
};

export const MEMBER_DELETE_LOADING = "MEMBER_DELETE_LOADING";
export const MEMBER_DELETE_SUCCESS = "MEMBER_DELETE_SUCCESS";
export const MEMBER_DELETE_FAILURE = "MEMBER_DELETE_FAILURE";

/**
 * deleteMember submits a request to the delete the
 * repository member and dispatches an event to update the
 * store.
 */
export const deleteMember = async (dispatch, state, username) => {
  dispatch({
    type: MEMBER_DELETE_LOADING
  });

  const { namespace, name } = state.route.params;
  const req = await fetch(`${instance}/api/repos/${namespace}/${name}/collaborators/${username}`, {
    headers,
    method: "DELETE",
    credentials: "same-origin"
  });

  if (req.status < 300) {
    dispatch({
      type: MEMBER_DELETE_SUCCESS,
      data: username
    });
  } else {
    const res = await req.json();
    dispatch({
      type: MEMBER_DELETE_FAILURE,
      error: res
    });
  }
};

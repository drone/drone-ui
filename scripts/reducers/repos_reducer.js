import {
  REPO_LIST_REQUEST,
  REPO_LIST_SUCCESS,
  REPO_LIST_FAILURE,
} from '../actions';

const initialState = {
  list: [],
  loading: true,
}

export function repos(state = initialState, action) {
  switch (action.type) {
  case REPO_LIST_REQUEST:
    return state;
  case REPO_LIST_SUCCESS:
    return Object.assign({}, state, { list: action.repos, loading: false })
  default:
    return state;
  }
}

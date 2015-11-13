import {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAILURE
} from '../actions/user_actions';

const initialState = {
  list: [],
  loading: true,
}

export function users(state = initialState, action) {
  switch (action.type) {
  case USER_LIST_REQUEST:
    return state;
  case USER_LIST_SUCCESS:
    return Object.assign({}, state, { list: action.users, loading: false })
  default:
    return state;
  }
}

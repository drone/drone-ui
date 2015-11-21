import {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAILURE,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAILURE,
  USER_UPDATE_SUCCESS,
  USER_DELETE_SUCCESS,
} from '../actions/user_actions';

const initialState = {
  list: [],
  loading: true,
  alerts: {}
}

export function users(state = initialState, action) {
  switch (action.type) {
  case USER_LIST_REQUEST:
    return state;
  case USER_LIST_SUCCESS:
    return Object.assign({}, state, { list: action.users, loading: false });
  case USER_CREATE_SUCCESS:
    state.list.push(action.user);
    return Object.assign({}, state, { alerts: {} });
  case USER_CREATE_FAILURE:
    return Object.assign({}, state, { alerts: { danger: action.error } });
  case USER_UPDATE_SUCCESS:
    var list = []
    state.list.forEach(function(user) {
      if (user.login === action.user.login) {
        list.push(action.user);
      } else {
        list.push(user)
      }
    })
    return Object.assign({}, state, { list: list });
  case USER_DELETE_SUCCESS:
    var list = []
    state.list.forEach(function(user) {
      if (user.login !== action.user.login) {
        list.push(user)
      }
    })
    return Object.assign({}, state, { list: list });
  default:
    return state;
  }
}

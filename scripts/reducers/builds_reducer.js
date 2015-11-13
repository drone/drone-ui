import {
  BUILD_LIST_REQUEST,
  BUILD_LIST_SUCCESS,
  BUILD_LIST_FAILURE,
} from '../actions/build_actions';

const initialState = {
  items: [],
  loading: true,
}

export function builds(state = initialState, action) {
  switch (action.type) {
  case BUILD_LIST_REQUEST:
    return Object.assign({}, state, {items: [], loading: true})
  case BUILD_LIST_SUCCESS:
    return Object.assign({}, state, {items: action.builds, loading: false})
  default:
    return state;
  }
}


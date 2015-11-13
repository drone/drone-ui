import {
  BUILD_REQUEST,
  BUILD_SUCCESS,
  BUILD_FAILURE,
} from '../actions/build_actions';

const initialState = {
  item: {},
  loading: true,
}

export function build(state = initialState, action) {
  switch (action.type) {
  case BUILD_REQUEST:
    return Object.assign({}, state, {item: {}, loading: true})
  case BUILD_SUCCESS:
    return Object.assign({}, state, {item: action.build, loading: false})
  default:
    return state;
  }
}


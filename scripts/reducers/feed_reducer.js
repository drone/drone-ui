import {
  FEED_REQUEST,
  FEED_SUCCESS,
  FEED_FAILURE
} from '../actions/feed_actions';

const initialState = {
  items: [],
  loading: true,
}

export function feed(state = initialState, action) {
  switch (action.type) {
  case FEED_REQUEST:
    return state;
  case FEED_SUCCESS:
    return Object.assign({}, state, {items: action.items, loading: false})
  default:
    return state;
  }
}

import Immutable from 'immutable';

import {
  FEED_RECEIVED
} from './actions';

let initialState = Immutable.Map();

export default
function feed(state = initialState, action) {
  switch (action.type) {
    case FEED_RECEIVED:
      return action.feed;
    default:
      return state;
  }
}

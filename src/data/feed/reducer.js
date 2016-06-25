import Immutable from 'immutable';

import { FEED_RECEIVED } from './actions';
import { EVENT_RECEIVED } from '../events/actions';

let initialState = Immutable.Map();

export default
function feed(state = initialState, action) {
  switch (action.type) {
    case EVENT_RECEIVED:
      let {event} = action;
      return state.merge(event.activity);
    case FEED_RECEIVED:
      return action.feed;
    default:
      return state;
  }
}

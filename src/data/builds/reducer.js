import Immutable from 'immutable';

import {
  BUILDS_RECEIVED,
  BUILD_RECEIVED
} from './actions';

let initialState = Immutable.Map();

export default
function builds(state = initialState, action) {
  switch (action.type) {
    case BUILDS_RECEIVED:
      return state.merge(action.builds);
    case BUILD_RECEIVED:
      return state.merge(action.build);
    default:
      return state;
  }
}

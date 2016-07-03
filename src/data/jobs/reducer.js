import Immutable from 'immutable';

import {} from './actions';
import { BUILD_RECEIVED } from '../builds/actions';

let initialState = Immutable.Map();

export default
function jobs(state = initialState, action) {
  switch (action.type) {
    case BUILD_RECEIVED:
      return state.merge(action.jobs);
    default:
      return state;
  }
}

import Immutable from 'immutable';

import { BUILDS_RECEIVED, BUILD_RECEIVED } from './actions';
import { JOB_RESTARTED } from '../jobs/actions';
import { EVENT_RECEIVED } from '../events/actions';

let initialState = Immutable.Map();

export default
function builds(state = initialState, action) {
  switch (action.type) {
    case BUILDS_RECEIVED:
      return state.merge(action.builds);
    case BUILD_RECEIVED:
      return state.merge(action.build);
    case JOB_RESTARTED:
      return state.merge(action.build);
    case EVENT_RECEIVED:
      // update existing build
      // update existing job
      return state;
    default:
      return state;
  }
}

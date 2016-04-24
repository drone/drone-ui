import Immutable from 'immutable';

import { USER_UPDATE } from './actions';

let initialState = Immutable.Map();

export default
function users(state = initialState, action) {
  switch (action.type) {
    case USER_UPDATE:
      state = state.mergeIn(['entities'], action.user);
      state = state.set('user_id', action.user.first().get('id'));
      return state;
    default:
      return state;
  }
}

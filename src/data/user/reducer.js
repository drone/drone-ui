import Immutable from 'immutable';

import { USER_UPDATE } from './actions';

let initialState = Immutable.Map();

export default
function user(state = initialState, action) {
  switch (action.type) {
    case USER_UPDATE:
      return action.user;
    default:
      return state;
  }
}

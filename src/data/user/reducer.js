import Immutable from 'immutable';

import {
  USER_SET
} from './actions';

let initialState = Immutable.Map();

export default
function user(state = initialState, action) {
  switch (action.type) {
  case USER_SET:
    return action.user;
  default:
    return state;
  }
}

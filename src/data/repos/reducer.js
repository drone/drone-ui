import Immutable from 'immutable';

import { USER_REPOS_RECEIVED } from './actions';

let initialState = Immutable.Map();

export default
function repos(state = initialState, action) {
  switch (action.type) {
    case USER_REPOS_RECEIVED:
      return action.repos;
    default:
      return state;
  }
}

import Immutable from 'immutable';

import {
  USER_REPOS_RECEIVED,
  REPO_RECEIVED
} from './actions';

let initialState = Immutable.Map();

export default
function repos(state = initialState, action) {
  switch (action.type) {
    case USER_REPOS_RECEIVED:
      return action.repos;
    case REPO_RECEIVED:
      return state.merge(action.repo);
    default:
      return state;
  }
}

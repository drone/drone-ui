import Immutable from 'immutable';

import {
  USER_REPOS_RECEIVED,
  REPO_RECEIVED
} from './actions';

import {BUILDS_RECEIVED} from '../builds/actions';

let initialState = Immutable.Map();

export default
function repos(state = initialState, action) {
  switch (action.type) {
    case USER_REPOS_RECEIVED:
      return action.repos;
    case REPO_RECEIVED:
      return state.merge(action.repo);
    case BUILDS_RECEIVED:
      const repository = state.find((repository) => { // find the repository to get its id
        return (
          repository.get('owner') == action.params.owner &&
          repository.get('name') == action.params.name
        );
      });
      return state.setIn([repository.get('id').toString(), 'builds'], action.buildIDs);
    default:
      return state;
  }
}

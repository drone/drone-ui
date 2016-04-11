import Immutable from 'immutable';

import {
  USER_REPOSITORIES_RECEIVED,
  REPOSITORY_RECEIVED
} from './actions';

import {BUILDS_RECEIVED} from '../builds/actions';

let initialState = Immutable.Map();

export default
function repositories(state = initialState, action) {
  switch (action.type) {
    case USER_REPOSITORIES_RECEIVED:
      return action.repositories;
    case REPOSITORY_RECEIVED:
      return state.merge(action.repository);
    case BUILDS_RECEIVED:
      const repository = state.find((repository) => { // find the repository to get its id
        return (
          repository.get('owner') == action.params.owner &&
          repository.get('name') == action.params.name
        );
      });
      if (repository == null) { // this can only happen, if the repository page is request at first
        console.log('repository was null while trying to add builds to it');
        return state;
      }
      return state.setIn([repository.get('id').toString(), 'builds'], action.buildIDs);
    default:
      return state;
  }
}

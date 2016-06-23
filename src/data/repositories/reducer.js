import Immutable from 'immutable';

import {
  USER_REPOSITORIES_RECEIVED,
  REPOSITORY_RECEIVED,
} from './actions';

import {BUILDS_RECEIVED} from '../builds/actions';

let initialState = Immutable.Map();

export default
function repositories(state = initialState, action) {
  let repository;

  switch (action.type) {
    case USER_REPOSITORIES_RECEIVED:
      return action.repositories;
    case REPOSITORY_RECEIVED:
      return state.merge(action.repository);
    case BUILDS_RECEIVED:
      repository = repositoryByOwnerName(state, action.params.owner, action.params.name);
      if (repository == null) { // this can only happen, if the repository page is request at first
        console.error('Repository was null while trying to add builds to it');
        return state;
      }
      return state.setIn([repository.get('full_name').toString(), 'builds'], action.buildIDs);
    default:
      return state;
  }
}

const repositoryByOwnerName = (state, owner, name) => {
  return state.find((repository) => {
    return (
      repository.get('owner') == owner &&
      repository.get('name') == name
    );
  });
};

import Immutable from 'immutable';

import {
  USER_REPOSITORIES_RECEIVED,
  REPOSITORY_RECEIVED,
} from './actions';

import {EVENT_RECEIVED} from '../events/actions';
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
    case EVENT_RECEIVED:
      const {params} = action;
      repository = repositoryByOwnerName(state, params.owner, params.name);
      if (repository == null) {
        return state;
      }
      // TODO figure out how to append the build ID into the repository if
      // is doesn't already exist in the index.

      // let buildIds = Immutable.fromJS([params.number]);
      // repository = repository.mergeIn('builds', buildIds);
      // return state.merge(repository)
      return state;
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

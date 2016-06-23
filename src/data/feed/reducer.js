import Immutable from 'immutable';

import {
  FEED_RECEIVED
} from './actions';

import {
  EVENT_RECEIVED
} from '../events/actions';

let initialState = Immutable.Map();

export default
function feed(state = initialState, action) {
  switch (action.type) {
    case EVENT_RECEIVED:
      let {event} = action;
      return state.update(event.repo.full_name, (repo) => {
        repo = repo.set('number', event.build.number);
        repo = repo.set('started_at', event.build.started_at);
        repo = repo.set('finished_at', event.build.finished_at);
        repo = repo.set('status', event.build.status);
        return repo;
      });
    case FEED_RECEIVED:
      return action.feed;
    default:
      return state;
  }
}

const reporepositoryLookup = (state, repo) => {
  return state.find((repository) => {
    return (
      repository.get('owner') == repo.owner &&
      repository.get('name') == repo.name
    );
  });
};

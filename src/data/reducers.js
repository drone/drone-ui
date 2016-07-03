import { combineReducers } from 'redux';

import user from './user/reducer';
import feed from './feed/reducer';
import jobs from './jobs/reducer';
import repositories from './repositories/reducer';
import builds from './builds/reducer';

export const drone = combineReducers({
  builds,
  feed,
  jobs,
  repositories,
  user,
});

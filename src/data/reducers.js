import { combineReducers } from 'redux';

import user from './user/reducer';
import jobs from './jobs/reducer';
import repositories from './repositories/reducer';
import builds from './builds/reducer';

export const drone = combineReducers({
  builds,
  jobs,
  repositories,
  user
});

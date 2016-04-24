import { combineReducers } from 'redux';

import users from './users/reducer';
import jobs from './jobs/reducer';
import repositories from './repositories/reducer';
import builds from './builds/reducer';

export const drone = combineReducers({
  builds,
  jobs,
  repositories,
  users
});

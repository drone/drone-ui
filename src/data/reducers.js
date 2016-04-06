import { combineReducers } from 'redux';

import user from './user/reducer';
import repos from './repos/reducer';
import builds from './builds/reducer';

export const drone = combineReducers({
  user,
  repos,
  builds
});

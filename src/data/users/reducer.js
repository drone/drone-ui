import Immutable from 'immutable';

import {
  USER_SET,
  USERS_RECEIVED,
  USER_CREATED,
  USER_UPDATED,
  USER_DELETED
} from './actions';

let initialState = Immutable.Map();

export default
function users(state = initialState, action) {
  switch (action.type) {
    case USER_SET:
      state = state.mergeIn(['entities'], action.user);
      state = state.set('user_id', action.user.first().get('id'));
      return state;
    case USERS_RECEIVED:
      return state.mergeIn(['entities'], action.users);
    case USER_CREATED:
      return state.mergeIn(['entities'], action.user);
    case USER_UPDATED:
      return state.mergeIn(['entities'], action.user);
    case USER_DELETED:
      const user = state.get('entities').find((user) => {
        return user.get('login') == action.login;
      });
      return state.deleteIn(['entities', user.get('id').toString()]);
    default:
      return state;
  }
}

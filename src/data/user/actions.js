import Immutable from 'immutable';
import { normalize, Schema } from 'normalizr';

export const userSchema = new Schema('user');

export function fetchWindowUser() {
  return dispatch => {
    const stateFromServer = normalize(window.STATE_FROM_SERVER.user, userSchema);
    dispatch(userListUpdate(Immutable.fromJS(stateFromServer.entities.user)));
  };
}

export const USER_UPDATE = 'USER_UPDATE';
export function userListUpdate(user) {
  return {
    type: USER_UPDATE,
    user
  };
}

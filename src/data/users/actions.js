import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

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

export function getUsers() {
  return dispatch => {
    Request.get('/api/users')
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        const users = normalize(JSON.parse(response.text), arrayOf(userSchema));
        dispatch(usersReceived(Immutable.fromJS(users.entities.user)));
      });
  };
}

export const USERS_RECEIVED = 'USERS_RECEIVED';
export function usersReceived(users) {
  return {
    type: USERS_RECEIVED,
    users
  };
}

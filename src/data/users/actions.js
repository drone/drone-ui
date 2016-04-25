import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

export const userSchema = new Schema('user');

export function fetchWindowUser() {
  return dispatch => {
    const stateFromServer = normalize(window.STATE_FROM_SERVER.user, userSchema);
    dispatch(setUser(Immutable.fromJS(stateFromServer.entities.user)));
  };
}

export const USER_SET = 'USER_SET';
export function setUser(user) {
  return {
    type: USER_SET,
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

        response = normalize(JSON.parse(response.text), arrayOf(userSchema));
        dispatch(usersReceived(Immutable.fromJS(response.entities.user)));
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

export function createUser(login) {
  return dispatch => {
    Request.post('/api/users/')
      .send({login})
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), userSchema);
        dispatch(userCreated(Immutable.fromJS(response.entities.user)));
      });
  };
}

export const USER_CREATED = 'USER_CREATED';
export function userCreated(user) {
  return {
    type: USER_CREATED,
    user
  };
}

export function updateUser(login, data) {
  return dispatch => {
    Request.patch(`/api/users/${login}`)
      .send(data)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), userSchema);
        dispatch(userUpdated(Immutable.fromJS(response.entities.user)));
      });
  };
}

export const USER_UPDATED = 'USER_CREATED';
export function userUpdated(user) {
  return {
    type: USER_UPDATED,
    user
  };
}

export function deleteUser(login) {
  return dispatch => {
    Request.del(`/api/users/${login}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        dispatch(userDeleted(login));
      });
  };
}

export const USER_DELETED = 'USER_DELETED';
export function userDeleted(login) {
  return {
    type: USER_DELETED,
    login
  };
}

import Immutable from 'immutable';

export function fetchWindowUser() {
  return dispatch => {
    let user = window.STATE_FROM_SERVER.user;
    dispatch(userListUpdate(Immutable.fromJS(user)));
  }
}

export const USER_UPDATE = 'USER_UPDATE';
export function userListUpdate(user) {
  return {
    type: USER_UPDATE,
    user
  }
}

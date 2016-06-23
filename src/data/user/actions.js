import Immutable from 'immutable';

export function fetchWindowUser() {
  return dispatch => {
    dispatch(setUser(Immutable.fromJS(window.STATE_FROM_SERVER.user)));
  };
}

export const USER_SET = 'USER_SET';
export function setUser(user) {
  return {
    type: USER_SET,
    user
  };
}

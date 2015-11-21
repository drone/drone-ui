import { ROUTER_DID_CHANGE } from "redux-router/lib/constants";
import * as actions from '../constants';

const initialState = {
  isError: false,
  isSuccess: false,
  isWarning: false,
  isLoading: false
}

export function status(state = initialState, action) {
  switch (action.type) {
  case ROUTER_DID_CHANGE:
    return initialState

  case actions.USER_CREATE_SUCCESS:
  case actions.USER_UPDATE_SUCCESS:
  case actions.USER_DELETE_SUCCESS:
    return Object.assign({}, initialState, {isSuccess: true});

  case actions.USER_UPDATE_FAILURE:
  case actions.USER_CREATE_FAILURE:
  case actions.USER_DELETE_FAILURE:
    return Object.assign({}, initialState, {isError: true});

  default:
    return state;
  }
}

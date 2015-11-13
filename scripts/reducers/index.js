import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router';
import { nodes } from "./nodes_reducer";
import { repos } from "./repos_reducer";
import { users } from "./users_reducer";
import { feed } from "./feed_reducer";
import { repo } from "./repo_reducer";
import { builds } from "./builds_reducer";
import { build } from "./build_reducer";
import { location } from "./location_reducer";

import {
	USER_REQUEST,
} from '../actions';

import {
  USER_TOKEN_SUCCESS,
} from '../actions/user_actions';

const initialState = {};

export function user(state = initialState, action) {
  switch (action.type) {
  case USER_TOKEN_SUCCESS:
    return Object.assign({}, state, {token: action.token})
  default:
    return state;
  }
}

export const drone = combineReducers({
  router: routerStateReducer,
  user: user,
  repo,
  users,
  repos,
  nodes,
  feed,
  builds,
  build,
  location
})

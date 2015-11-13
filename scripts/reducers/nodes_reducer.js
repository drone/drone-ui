import {
	NODE_LIST_REQUEST,
	NODE_LIST_SUCCESS,
	NODE_LIST_FAILURE
} from '../actions/node_actions';

const initialState = {
  list: [],
  loading: true,
}

export function nodes(state = initialState, action) {
  switch (action.type) {
  case NODE_LIST_REQUEST:
    return state;
  case NODE_LIST_SUCCESS:
    return Object.assign({}, state, {list: action.nodes, loading: false})
  default:
    return state;
  }
}

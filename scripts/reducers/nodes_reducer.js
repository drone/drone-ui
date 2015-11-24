import {
	NODE_LIST_REQUEST,
	NODE_LIST_SUCCESS,
	NODE_LIST_FAILURE,
  NODE_CREATE_SUCCESS,
  NODE_CREATE_FAILURE,
  NODE_DELETE_SUCCESS
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
    return Object.assign({}, state, {list: action.nodes, loading: false});

  case NODE_DELETE_SUCCESS:
    var list = []
    state.list.forEach(function(node) {
      if (node.id !== action.node.id) {
        list.push(node)
      }
    })
    return Object.assign({}, state, { list: list });

  case NODE_CREATE_SUCCESS:
    state.list.push(action.user);
    return state;

  default:
    return state;
  }
}

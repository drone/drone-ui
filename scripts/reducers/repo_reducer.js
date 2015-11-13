import {
  REPO_REQUEST,
  REPO_SUCCESS,
  REPO_FAILURE,
  REPO_PATCH_SUCCESS,
  KEY_SUCCESS,
} from '../actions';

const initialState = {
  repo: {},
  keys: {},
  loading: true
};

export function repo(state = initialState, action) {
  switch (action.type) {
  case REPO_REQUEST:

    // if the repository already exists we can
    // load what we have.
    const {owner, name} = action;
    if (state.repo.owner === owner && state.repo.name === name) {
      return state;
    }

    // otherwise construct a temporary object with
    // what we know about the repository.
    const repo = {
      owner,
      name,
      full_name: `${owner}/${name}`,
    };
    return Object.assign({}, state, {repo: repo, loading: true, keys: {}})
  case KEY_SUCCESS:
    return Object.assign({}, state, {keys: action.keys})


  case REPO_PATCH_SUCCESS:
  case REPO_SUCCESS:
    return Object.assign({}, state, {repo: action.repo, loading: false})

  default:
    return state;
  }
}

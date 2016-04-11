import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

const repoSchema = new Schema('repo');

export function getUserRepos() {
  return dispatch => {
    Request.get('/api/user/repos')
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), arrayOf(repoSchema));
        let repos = Immutable.fromJS(response.entities.repo);
        dispatch(userReposReceived(repos));
      });
  };
}

export const USER_REPOS_RECEIVED = 'USER_REPOS_RECEIVED';
export function userReposReceived(repos) {
  return {
    type: USER_REPOS_RECEIVED,
    repos
  };
}

export function getRepo(owner, name) {
  return dispatch => {
    Request.get(`/api/repos/${owner}/${name}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err);
        }

        response = normalize(JSON.parse(response.text), repoSchema);
        let repo = Immutable.fromJS(response.entities.repo);

        dispatch(repoReceived({owner, name}, repo));
      });
  };
}

export const REPO_RECEIVED = 'REPO_RECEIVED';
export function repoReceived(params, repo) {
  return {
    type: REPO_RECEIVED,
    params,
    repo
  };
}

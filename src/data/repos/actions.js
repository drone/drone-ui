import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

const repoSchema = new Schema('repo');

export function getUserRepos() {
  return dispatch => {
    Request.get('/api/user/repos')
      .end((err, response) => {
        if(err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), arrayOf(repoSchema));

        dispatch(userReposReceived(Immutable.Map(response.entities.repo)));
      })
  }
}

export const USER_REPOS_RECEIVED = 'USER_REPOS_RECEIVED';
export function userReposReceived(repos) {
  return {
    type: USER_REPOS_RECEIVED,
    repos
  }
}

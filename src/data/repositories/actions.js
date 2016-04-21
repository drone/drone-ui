import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

export const repositorySchema = new Schema('repository');

export function getUserRepositories() {
  return dispatch => {
    Request.get('/api/user/repos')
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), arrayOf(repositorySchema));
        let repositories = Immutable.fromJS(response.entities.repository);
        dispatch(userRepositoriesReceived(repositories));
      });
  };
}

export const USER_REPOSITORIES_RECEIVED = 'USER_REPOSITORIES_RECEIVED';
export function userRepositoriesReceived(repositories) {
  return {
    type: USER_REPOSITORIES_RECEIVED,
    repositories
  };
}

export function getRepository(owner, name) {
  return dispatch => {
    Request.get(`/api/repos/${owner}/${name}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err);
        }

        response = normalize(JSON.parse(response.text), repositorySchema);
        let repository = Immutable.fromJS(response.entities.repository);

        dispatch(repositoryReceived({owner, name}, repository));
      });
  };
}

export const REPOSITORY_RECEIVED = 'REPOSITORY_RECEIVED';
export function repositoryReceived(params, repository) {
  return {
    type: REPOSITORY_RECEIVED,
    params,
    repository
  };
}

export function getRepositoryKey(owner, name) {
  return dispatch => {
    Request.get(`/api/repos/${owner}/${name}/key`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        const key = response.text;

        dispatch(repositoryKeyReceived({owner, name}, key));
      });
  };
}

export const REPOSITORY_KEY_RECEIVED = 'REPOSITORY_KEY_RECEIVED';
export function repositoryKeyReceived(params, key) {
  return {
    type: REPOSITORY_KEY_RECEIVED,
    params,
    key
  };
}

export function updateRepository(owner, name, data) {
  return dispatch => {
    Request.patch(`/api/repos/${owner}/${name}`)
      .send(data)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), repositorySchema);
        let repository = Immutable.fromJS(response.entities.repository);

        dispatch(repositoryReceived({owner, name}, repository));
      });
  };
}

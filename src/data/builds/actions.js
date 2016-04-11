import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

const buildSchema = new Schema('build');

export function getBuilds(owner, name) {
  return dispatch => {
    Request.get(`/api/repos/${owner}/${name}/builds`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), arrayOf(buildSchema));
        let builds = Immutable.fromJS(response.entities.build);
        let buildIDs = Immutable.fromJS(response.result);

        dispatch(buildsReceived({owner, name}, builds, buildIDs));
      });
  };
}

export const BUILDS_RECEIVED = 'BUILDS_RECEIVED';
export function buildsReceived(params, builds, buildIDs) {
  return {
    type: BUILDS_RECEIVED,
    params,
    builds,
    buildIDs
  };
  };
}

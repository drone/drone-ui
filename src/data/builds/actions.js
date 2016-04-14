import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, arrayOf, Schema } from 'normalizr';

import {jobSchema} from '../jobs/actions';

export const buildSchema = new Schema('build');

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
}

export function getBuild(owner, name, number) {
  return dispatch => {
    Request.get(`/api/repos/${owner}/${name}/builds/${number}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        buildSchema.define({
          jobs: arrayOf(jobSchema)
        });

        response = normalize(JSON.parse(response.text), buildSchema);
        let build = Immutable.fromJS(response.entities.build);
        let jobs = Immutable.fromJS(response.entities.job);

        dispatch(buildReceived({owner, name, number}, build, jobs));
      });
  };
}

export const BUILD_RECEIVED = 'BUILD_RECEIVED';
export function buildReceived(params, build, jobs) {
  return {
    type: BUILD_RECEIVED,
    params,
    build,
    jobs
  };
}

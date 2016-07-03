import Immutable from 'immutable';
import Request from 'superagent';
import { normalize, Schema } from 'normalizr';

import { buildSchema } from '../builds/actions';
export const jobSchema = new Schema('job');

export function cancelJob(owner, name, build, job) {
  return dispatch => {
    Request.del(`/api/repos/${owner}/${name}/builds/${build}/${job}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        dispatch(jobCanceled({owner, name, build, job}));
      });
  };
}

export const JOB_CANCELED = 'JOB_CANCELED';
export function jobCanceled(params) {
  return {
    type: JOB_CANCELED,
    params
  };
}

export function restartJob(owner, name, build) {
  return dispatch => {
    Request.post(`/api/repos/${owner}/${name}/builds/${build}`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        response = normalize(JSON.parse(response.text), buildSchema);
        let build = Immutable.fromJS(response.entities.build);

        dispatch(jobRestarted({owner, name, build}, build));
      });
  };
}

export const JOB_RESTARTED = 'JOB_RESTARTED';
export function jobRestarted(params, build) {
  return {
    type: JOB_RESTARTED,
    params,
    build
  };
}

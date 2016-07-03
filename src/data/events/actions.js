import Immutable from 'immutable';
import { normalize, arrayOf, Schema } from 'normalizr';

import {feedSchema} from '../feed/actions';
import {jobSchema} from '../jobs/actions';
import {buildSchema} from '../builds/actions';
import {repositorySchema} from '../repositories/actions';

export function dispatchEvent(event) {
  return dispatch => {

    let activity = Immutable.fromJS(normalize({
      owner: event.repo.owner,
      name: event.repo.name,
      full_name: event.repo.full_name,
      number: event.build.number,
      started_at: event.build.started_at,
      finished_at: event.build.finished_at,
      status: event.build.status,
    }, feedSchema).entities.feed);
    let repo = Immutable.fromJS(normalize(event.repo, repositorySchema).entities.repository);
    let build = Immutable.fromJS(normalize(event.build, buildSchema).entities.build);
    let job = Immutable.fromJS(normalize(event.job, jobSchema).entities.job);

    let params = {
      owner: event.repo.owner,
      name: event.repo.name,
      number: event.build.number,
      job: event.job ? event.job.number : 0,
    }
    dispatch(eventReceived(params, {
      activity,
      repo,
      build,
      job,
    }));
  };
}

export const EVENT_RECEIVED = 'EVENT_RECEIVED';
export function eventReceived(params, event) {
  return {
    type: EVENT_RECEIVED,
    params,
    event
  };
}

import React from 'react';
import moment from 'moment';

import './job_list_item.less';

import Status, { PENDING, RUNNING } from './status';

export default
class JobListItem extends React.Component {
  render() {
    const {job} = this.props;

    return (
      <div className="job-list-item">
        <Status state={job.get('status')}/>

        {job.get('status') == PENDING ?
          <div>pending assignment to a worker</div>
          : null}
        {job.get('status') == RUNNING ?
          <div>started {moment(job.get('started_at') * 1000).fromNow()}</div>
          : null}
        {job.get('finished_at') != 0 ?
          <div>
            <div>started {moment(job.get('finished_at') * 1000).fromNow()}</div>
            <div>with exit code {job.get('exit_code')}</div>
          </div>
          : null}
      </div>
    );
  }
}

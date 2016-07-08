import React from 'react';
import moment from 'moment';

import './job_list_item.less';

import Status, { PENDING, RUNNING } from './status';

export default
class JobListItem extends React.Component {
  render() {
    const {repo, build, job} = this.props;

    return (
      <div className="job-list-item">
        <Status state={job.status} />
      </div>
    );
  }
}

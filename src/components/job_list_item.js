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
        <div>
          <h3>
            {Object.keys(job.environment).map((key) => {
              return (
                <div key={key}>{key}={job.environment[key]}</div>
              )
            })}
          </h3>
        </div>
        <div>
          <span># {job.number}</span>
          <Status state={job.status} />
        </div>
      </div>
    );
  }
}

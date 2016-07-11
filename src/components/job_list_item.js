import React from 'react';
import Status from './status';

import './job_list_item.less';

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
              );
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

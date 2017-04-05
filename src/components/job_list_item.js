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
            {Object.keys(job.environ || {}).map((key) => {
              return (
                <div key={key}>{key}={job.environ[key]}</div>
              );
            })}
          </h3>
        </div>
        <div>
          <span># {job.pid}</span>
          <Status state={job.state} />
        </div>
      </div>
    );
  }
}

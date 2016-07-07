import React from 'react';
import Status from './status';
import moment from 'moment';

import './repo_list_item.less';

export default
class RepoListItem extends React.Component {
  render() {
    const {repo} = this.props;

    let start = repo.started_at * 1000;
    let finished = repo.finished_at * 1000;
    let duration = finished - start;

    return (
      <div className="repo-list-item">
        <div className="repo-list-item-header">
          <span>{repo.full_name}</span>
          <Status state={repo.status} />
        </div>
        <div className="repo-list-item-body">
          <div>
            <i className="material-icons">timelapse</i>
            <span>{duration == NaN ? "--" : moment.duration(duration).humanize()}</span>
          </div>
          <div>
            <i className="material-icons">access_time</i>
            <span>{!start ? "--" : moment(start).fromNow()}</span>
          </div>
        </div>
      </div>
    );
  }
}

import React from 'react';
import Status from './status';

import './repo_list_item.less';

export default
class RepoListItem extends React.Component {
  render() {
    const {repo} = this.props;

    let start = repo.get('created_at') * 1000;
    let finished = repo.get('finished_at') * 1000;
    let duration = finished - start;

    return (
      <div className="repo-list-item">
        <div className="repo-list-item-header">
          <span>{repo.get('full_name')}</span>
          <Status state={repo.get('status')} />
        </div>
        <div className="repo-list-item-body">
          <div>
            <i className="material-icons">timelapse</i>
            <span>{moment.duration(duration).humanize()}</span>
          </div>
          <div>
            <i className="material-icons">access_time</i>
            <span>{moment(start).fromNow()}</span>
          </div>
        </div>
      </div>
    );
  }
}

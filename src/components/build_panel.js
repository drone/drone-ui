import Humanize from './humanize';
import React from 'react';
import TimeAgo from 'react-timeago';

import './build_panel.less';

export default
class BuildPanel extends React.Component {
  render() {
    const {build, job} = this.props;

    let classes = ['build-panel', job.status];

    let environs = [];
    if (job && job.environment) {
      Object.keys(job.environment).map((key) => {
        environs.push(
          <code key={key}>{key}={job.environment[key]}</code>
        );
      });
    }

    return (
      <div className={classes.join(' ')}>
        <div className="build-panel-detail">
          <div>
            <div><em>Branch:</em> {build.branch}</div>
            <div>
              <em>Commit:</em> {build.commit.substr(0,8)}
              <a href={build.link_url} target="_blank" className="commit-link">
                <i className="material-icons">insert_link</i>
              </a>
            </div>
            <div><em>Author:</em> {build.author}</div>
            <p>{environs}{build.message}</p>
          </div>
          <div>
            <div>
              <i className="material-icons">access_time</i>
              {job.started_at ?
                <TimeAgo date={(job.started_at || build.created_at) * 1000} /> :
                <span>--</span>
              }
            </div>
            <div>
              <i className="material-icons">timelapse</i>
              {job.finished_at ?
                <Humanize finished={job.finished_at} start={job.started_at} /> :
                <TimeAgo date={(job.started_at || build.created_at) * 1000} />
              }
            </div>
          </div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
/**/

import Humanize from './humanize';
import React from 'react';
import TimeAgo from 'react-timeago';

import './build_panel.less';

export default
class BuildPanel extends React.Component {

  renderParentLink(parent) {
    const {repo} = this.props;
    if (parent > 0) {
      return (
        <div>
          <em>Parent:</em> #{parent}
          <a href={`/${repo.owner}/${repo.name}/${parent}`} className="parent-link">
            <i className="material-icons">insert_link</i>
          </a>
        </div>
      );
    }
  }

  render() {
    const {build, job} = this.props;

    let classes = ['build-panel', job.state || job.status];

    let environs = [];
    if (job && job.environ) {
      Object.keys(job.environ).map((key) => {
        environs.push(
          <code key={key}>{key}={job.environ[key]}</code>
        );
      });
    }

    let branch = (build.refspec != '' && build.event == 'pull_request') ?
      build.refspec : build.branch;

    return (
      <div className={classes.join(' ')}>
        <div className="build-panel-detail">
          <div>
            <div><em>Branch:</em> {branch}</div>
            <div>
              <em>Commit:</em> {build.commit.substr(0,8)}
              <a href={build.link_url} target="_blank" className="commit-link">
                <i className="material-icons">insert_link</i>
              </a>
            </div>
            <div><em>Author:</em> {build.author}</div>
            {this.renderParentLink(build.parent)}
            <p>{environs}{build.message}</p>
          </div>
          <div>
            <div>
              <i className="material-icons">access_time</i>
              {job.finished_at ?
                <Humanize finished={job.finished_at} start={job.started_at} /> :
                <TimeAgo date={(job.started_at || build.created_at) * 1000} />
              }
            </div>
            <div>
              <i className="material-icons">timelapse</i>
              {job.end_time ?
                <Humanize finished={job.end_time} start={job.start_time} /> :
                <span>--</span>
              }
            </div>
          </div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

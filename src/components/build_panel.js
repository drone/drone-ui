import moment from 'moment';
import React from 'react';

import './build_panel.less';

export default
class BuildPanel extends React.Component {
  render() {
    const {build, job} = this.props;

    let start = build.created_at * 1000;
    let finished = build.finished_at * 1000;
    let duration = finished - start;

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
              <i className="material-icons">timelapse</i>
              <span>{moment.duration(duration).humanize()}</span>
            </div>
            <div>
              <i className="material-icons">access_time</i>
              <span>{moment(start).fromNow()}</span>
            </div>
          </div>
        </div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

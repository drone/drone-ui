import React from 'react';
import moment from 'moment';

import './build_panel.less';

export default
class BuildPanel extends React.Component {
  render() {
    const {build, job} = this.props;

    let start = build.created_at * 1000;
    let finished = build.finished_at * 1000;
    let duration = finished - start;

    let classes = ["build-panel", job.status];

    return (
     <div className={classes.join(' ')}>
        <div>
          <div><em>Branch:</em> {build.branch}</div>
          <div><em>Commit:</em> {build.commit.substr(0,8)}</div>
          <div><em>Author:</em> {build.author}</div>
          <p>{build.message}</p>
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
    );
  }
}

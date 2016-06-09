import React from 'react';

import './build_panel.less';

export default
class BuildPanel extends React.Component {
  render() {
    const {build, job} = this.props;

    let start = build.get('created_at') * 1000;
    let finished = build.get('finished_at') * 1000;
    let duration = finished - start;

    let classes = ["build-panel", job.get('status')];

    return (
     <div className={classes.join(' ')}>
        <div>
          <div><em>Branch:</em> {build.get('branch')}</div>
          <div><em>Commit:</em> {build.get('commit').substr(0,8)}</div>
          <div><em>Author:</em> {build.get('author')}</div>
          <p>{build.get('message')}</p>
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

import React from 'react';
import TimeAgo from 'react-timeago';

import './build_meta.less';

export default
class BuildMeta extends React.Component {
  render() {
    const {build} = this.props;

    var eventDesc;
    var eventDest;

    switch(build.event) {
    case 'push':
      eventDesc = 'pushed to';
      eventDest = build.branch;
      break;
    case 'pull_request':
      eventDesc = 'opened pull request to';
      eventDest = build.branch;
      break;
    case 'tag':
      eventDesc = 'pushed tag';
      eventDest = build.ref;
      break;
    case 'deployment':
      eventDesc = 'deployed to';
      eventDest = build.deploy_to;
      break;
    }

    return (
      <p className="build-meta">
        <em>{build.author}</em>
        <span>{eventDesc}</span>
        <em>{eventDest}</em>
        <TimeAgo date={(build.created_at || build.enqueued_at) * 1000} />
      </p>
    );
  }
}

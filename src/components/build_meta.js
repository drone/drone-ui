import React from 'react';

import './build_meta.less';

export default
class BuildMeta extends React.Component {
  render() {
    const {build} = this.props;

    return (
      <p className="build-meta">
        <em>{build.get('author')}</em>
        <span>pushed to</span>
        <em>{build.get('branch')}</em>
      </p>
    );
  }
}

// <em>{moment(build.get('created_at') * 1000).fromNow()}</em>

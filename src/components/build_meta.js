import React from 'react';

import './build_meta.less';

export default
class BuildMeta extends React.Component {
  render() {
    const {build} = this.props;

    return (
      <p className="build-meta">
        <em>{build.author}</em>
        <span>pushed to</span>
        <em>{build.branch}</em>
      </p>
    );
  }
}

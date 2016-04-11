import React from 'react';

import Avatar from './avatar';
import Status from './status';
import BuildMeta from './build_meta';

export default
class BuildCard extends React.Component {
  render() {
    const {build} = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <Avatar src={build.get('author_avatar')}/>
        </div>
        <div className="card-block">
          <div>
            <Status state={build.get('status')}/>
            <h3>{build.get('message')}</h3>
          </div>
            <BuildMeta build={build}/>
        </div>
      </div>
    );
  }
}

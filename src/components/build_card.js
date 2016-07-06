import React from 'react';

import Avatar from './avatar';
import Status from './status';
import BuildMeta from './build_meta';

import './build_card.less';

export default
class BuildCard extends React.Component {
  render() {
    const {build} = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <Avatar src={build.author_avatar}/>
        </div>
        <div className="card-block">
          <div>
            <h3>{build.message}</h3>
          </div>
          <BuildMeta build={build}/>
        </div>
        <div className="card-footer">
          <div>{build.number}</div>
          <Status state={build.status}/>
        </div>
      </div>
    );
  }
}

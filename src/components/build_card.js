import Avatar from './avatar';
import BuildMeta from './build_meta';
import React from 'react';
import Status from './status';

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
            <h3>{build.message.split('\n')[0]}</h3>
          </div>
          <BuildMeta build={build}/>
        </div>
        <div className="card-footer">
          <div>{build.number}{(build.parent > 0) ? ` < # ${build.parent}` : ''}</div>
          <Status state={build.status}/>
        </div>
      </div>
    );
  }
}

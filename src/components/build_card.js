import React from 'react';
import moment from 'moment';

import Avatar from '../components/avatar';

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
          <p>
            <em>{build.author}</em>
            <span>authored</span>
            <em>{moment(build.created_at * 1000).fromNow()}</em>
            <span>to</span>
            <em>{build.branch}</em>
          </p>
        </div>
      </div>
    );
  }
}

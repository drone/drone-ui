import React from 'react';
import moment from 'moment';

import Avatar from '../components/avatar';
import Status from '../components/status';

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
          <p>
            <em>{build.get('author')}</em>
            <span>authored</span>
            <em>{moment(build.get('created_at') * 1000).fromNow()}</em>
            <span>to</span>
            <em>{build.get('branch')}</em>
          </p>
        </div>
      </div>
    );
  }
}

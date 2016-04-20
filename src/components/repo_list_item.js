import React from 'react';

import Avatar from './avatar';

export default
class RepoListItem extends React.Component {
  render() {
    const {repo} = this.props;

    return (
      <div className="repo-list-item">
        <Avatar src={repo.get('avatar_url')}/>
        <span>{repo.get('name')}</span>
      </div>
    );
  }
}

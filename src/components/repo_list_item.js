import React from 'react';

import Avatar from './avatar';

export default
class RepoListItem extends React.Component {
  render() {
    const {repo} = this.props;

    return (
      <div className="repo-list-item">
        <Avatar src={repo.avatar_url}/>
        <span>{repo.name}</span>
      </div>
    )
  }
}

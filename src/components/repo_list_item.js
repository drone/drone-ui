import React from 'react';

export default
class RepoListItem extends React.Component {
  render() {
    const {repo} = this.props;

    return (
      <div className="repo-list-item">
        <span>{repo.get('full_name')}</span>
      </div>
    );
  }
}

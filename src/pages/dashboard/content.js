import React from 'react';
import { connect } from 'react-redux';

import { getUserRepos } from '../../data/repos/actions';
import RepoListItem from '../../components/repo_list_item';

class Content extends React.Component {
  componentDidMount() {
    this.props.dispatch(getUserRepos());
  }

  render() {
    let {repos} = this.props;

    if (repos.size == 0) {
      return <div></div>;
    }

    // Sort by repo's name
    repos = repos.toList();
    repos = repos.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="dashboard">
        {repos.map((repo, index) => {
          return (
            <div key={repo.id}>
              <RepoListItem repo={repo}/>
              {index < repos.size - 1 ? <hr/> : null}
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect(
  state => ({
    repos: state.drone.repos
  })
)(Content);

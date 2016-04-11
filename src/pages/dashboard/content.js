import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
      return a.get('name').localeCompare(b.get('name'));
    });

    return (
      <div className="dashboard">
        {repos.map((repo, index) => {
          return (
            <Link key={repo.get('id')} to={`/${repo.get('owner')}/${repo.get('name')}`}>
              <RepoListItem repo={repo}/>
              {index < repos.size - 1 ? <hr/> : null}
            </Link>
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

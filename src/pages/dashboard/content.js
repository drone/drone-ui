import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getUserRepositories } from '../../data/repositories/actions';
import RepoListItem from '../../components/repo_list_item';

class Content extends React.Component {
  componentDidMount() {
    this.props.dispatch(getUserRepositories());
  }

  render() {
    let {repositories} = this.props;

    if (repositories.size == 0) {
      return <div></div>;
    }

    // Sort by repo's name
    repositories = repositories.toList();
    repositories = repositories.sort((a, b) => {
      return a.get('name').localeCompare(b.get('name'));
    });

    return (
      <div className="dashboard">
        {repositories.map((repo, index) => {
          return (
            <Link key={repo.get('id')} to={`/${repo.get('owner')}/${repo.get('name')}`}>
              <RepoListItem repo={repo}/>
              {index < repositories.size - 1 ? <hr/> : null}
            </Link>
          );
        })}
      </div>
    );
  }
}

export default connect(
  state => ({
    repositories: state.drone.repositories
  })
)(Content);

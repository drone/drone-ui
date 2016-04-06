import React from 'react';
import { connect } from 'react-redux';

import { getRepo } from '../../data/repos/actions';
import { getBuilds } from '../../data/builds/actions';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;

    this.props.dispatch(getRepo(owner, name));
    this.props.dispatch(getBuilds(owner, name));
  }

  render() {
    let {repository, builds} = this.props;

    if (repository == null || builds == null) {
      return (
        <div>Loading...</div>
      );
    }

    builds = builds.toList().sort((a, b) => {
      return a.timestamp < b.timestamp;
    });

    return (
      <div>
        repository!
        <ul>
          {builds.map((build) => {
            return (
              <li key={build.id}>{build.id}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  (state, router) => ({
    repository: state.drone.repos.find((repository) => {
      return repository.owner === router.params.owner && repository.name === router.params.name;
    }),
    builds: state.drone.builds
  })
)(Content);

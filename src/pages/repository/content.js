import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import './index.less';

import { getRepository } from '../../data/repositories/actions';
import { getBuilds } from '../../data/builds/actions';
import PageContent from '../../components/layout/content';
import BuildCard from '../../components/build_card';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;

    this.props.dispatch(getRepository(owner, name));
    this.props.dispatch(getBuilds(owner, name));
  }

  render() {
    const {owner, name} = this.props.params;
    let {repository, builds} = this.props;

    if (repository == null && builds == null) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <PageContent className="repository history">
        {builds.toList().reverse().map((build, index) => {
          return (
            <Link key={build.get('number')} to={`/${owner}/${name}/${build.get('number')}`}>
              <BuildCard build={build}/>
            </Link>
          );
        })}
      </PageContent>
    );
  }
}

export default connect(
  (state, ownProps) => {
    const repository = state.drone.repositories.find((repository) => { // find the correct repository by owner & name
      return (
        repository.get('owner') == ownProps.params.owner &&
        repository.get('name') == ownProps.params.name
      );
    });

    const builds = state.drone.builds
      .filter((build) => { // filter builds for this repository
        if (repository == null || repository.get('builds') == null) { // If there are no builds don't return any builds (=loading)
          return false;
        }

        return repository.get('builds').includes(build.get('id')); // If this build belongs to repo's builds
      })
      .sort((a, b) => { // sort all grouped builds descending
        return a.get('id') < b.get('id') ? -1 : 1;
      });

    return {
      repository,
      builds
    };
  }
)(Content);

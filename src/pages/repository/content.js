import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

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
      <PageContent className="repository timeline">
        {builds.toList().reverse().map((dayBuilds, index) => {
          dayBuilds = dayBuilds.toList().sort((a, b) => {
            return a.get('id') < b.get('id') ? 1 : -1;
          });

          const date = new Date(dayBuilds.first().get('created_at') * 1000);

          return (
            <div key={index} className="group">
              <div className="group-title">
                Commits on {moment(date).format('MMM Do YYYY')}
              </div>
              {dayBuilds.map((build) => {
                return (
                  <Link key={build.get('number')} to={`/${owner}/${name}/${build.get('number')}`}>
                    <BuildCard build={build}/>
                  </Link>
                );
              })}
            </div>
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
      .groupBy((build) => { // group all builds by day of date
        const date = new Date(build.get('created_at') * 1000);
        return `${date.getFullYear()}-${('0' + date.getMonth()).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      })
      .sort((a, b) => { // sort all grouped builds descending
        return a.first().get('id') > b.first().get('id') ? 1 : -1;
      });

    return {
      repository,
      builds
    };
  }
)(Content);

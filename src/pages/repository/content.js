import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

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

    return (
      <div className="repository timeline">
        {builds.toList().reverse().map((dayBuilds, index) => {
          dayBuilds = dayBuilds.toList().sort((a, b) => {
            return a.id < b.id ? 1 : -1;
          });

          const date = new Date(dayBuilds.first().timestamp * 1000);

          return (
            <div key={index} className="group">
              <div className="group-title">
                Commits on {moment(date).format('MMM Do YYYY')}
              </div>
            </div>
          );
        })}
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
      .groupBy((build) => { // group all builds by day of date
        const date = new Date(build.timestamp * 1000);
        return `${date.getFullYear()}-${('0' + date.getMonth()).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      })
      .sort((a, b) => { // sort all grouped builds descending
        return a.first().id > b.first().id ? 1 : -1;
      })
  })
)(Content);

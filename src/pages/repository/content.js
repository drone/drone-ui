import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { getRepo } from '../../data/repos/actions';
import { getBuilds } from '../../data/builds/actions';
import BuildCard from '../../components/build_card';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name} = this.props.params;

    this.props.dispatch(getRepo(owner, name));
    this.props.dispatch(getBuilds(owner, name));
  }

  render() {
    const {owner, name} = this.props.params;
    let {repository, builds} = this.props;

    console.log(repository, builds);

    if (repository == null && builds == null) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="repository timeline">
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
      </div>
    );
  }
}

export default connect(
  (state, router) => ({
    repository: state.drone.repos.find((repository) => {
      return (
        repository.get('owner') == router.params.owner &&
        repository.get('name') == router.params.name
      );
    }),
    builds: state.drone.builds
      .groupBy((build) => { // group all builds by day of date
        const date = new Date(build.get('created_at') * 1000);
        return `${date.getFullYear()}-${('0' + date.getMonth()).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      })
      .sort((a, b) => { // sort all grouped builds descending
        return a.first().get('id') > b.first().get('id') ? 1 : -1;
      })
  })
)(Content);

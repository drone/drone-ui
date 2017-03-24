import {BLOCKED} from '../../components/status';
import {branch} from 'baobab-react/higher-order';
import {Matrix} from './matrix';
import React from 'react';
import {Results} from './results';
import {events, GET_BUILD} from '../../actions/events';

import './index.less';

// import { cancelJob, restartJob } from '../../data/jobs/actions';

class Content extends React.Component {
  constructor(props) {
    super(props);

    // this.handleJobCancel = this.handleJobCancel.bind(this);
    // this.handleJobRestart = this.handleJobRestart.bind(this);
  }

  componentDidMount() {
    const {owner, name, number} = this.props.params;
    events.emit(GET_BUILD, {owner, name, number});
  }
  //
  // shouldComponentUpdate(nextProps) {
  //   return this.props.build != nextProps.build || this.props.logs != nextProps.logs;
  // }

  componentWillReceiveProps(nextProps) {
    const {owner, name, number} = this.props.params;
    const {owner: nextOwner, name: nextName, number: nextNumber} = nextProps.params;
    if (nextOwner != owner || nextName != name || nextNumber != number) {
      events.emit(GET_BUILD, {owner, name, number});
    }
  }

  render() {
    const {owner, name, job} = this.props.params;
    const {build, logs, state} = this.props;

    if (build instanceof Error) {
      return (
        <div className="alert alert-empty">This build is Not Found</div>
      );
    }

    if (!build || !build.jobs) {
      return (
        <div>Loading...</div>
      );
    }

    if (build.status == BLOCKED || build.error != '') {
      return (
        <Results
          repo={{owner: owner, name: name}}
          build={build}
          job={{number:0, status: build.status}}
          follow={state.follow}
          logs={logs}>
        </Results>
      );
    }

    if (build.jobs.length != 1 && !job) {
      return (
        <Matrix repo={{owner: owner, name: name}} build={build}></Matrix>
      );
    }

    return (
      <Results
        repo={{owner: owner, name: name}}
        build={build}
        job={build.jobs[job ? job-1 : 0]}
        follow={state.follow}
        logs={logs}>
      </Results>
    );
  }
}

export default branch((props) => {
  const {owner, name, number} = props.params;
  return {
    state: ['pages', 'build'],
    repository: ['repos', owner, name],
    build: ['builds', owner, name, number],
    logs: ['logs']
  };
}, Content);

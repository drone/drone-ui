import {BLOCKED} from '../../components/status';
import {branch} from 'baobab-react/higher-order';
import {Matrix} from './matrix';
import React from 'react';
import {Results} from './results';
import {events, GET_BUILD} from '../../actions/events';

import './index.less';

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {owner, name, number} = this.props.params;
    events.emit(GET_BUILD, {owner, name, number});
  }

  componentWillReceiveProps(nextProps) {
    const {owner, name, number} = this.props.params;
    const {owner: nextOwner, name: nextName, number: nextNumber, job: nextProc} = nextProps.params;
    if (nextOwner != owner || nextName != name || nextNumber != number) {
      events.emit(GET_BUILD, {
        owner: nextOwner,
        name: nextName,
        number: nextNumber,
        pid: nextProc
      });
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

    if (!build) {
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

    if (!build.procs || (build.procs.length != 1 && !job)) {
      return (
        <Matrix repo={{owner: owner, name: name}} build={build}></Matrix>
      );
    }

    return (
      <Results
        repo={{owner: owner, name: name}}
        build={build}
        job={build.procs[job ? job-1 : 0]}
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

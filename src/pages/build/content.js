import React from 'react';
import {branch} from 'baobab-react/higher-order';
import {Button} from 'react-mdl';

import {Matrix} from './matrix';
import {Results} from './results';

import './index.less';

import PageContent from '../../components/layout/content';
import BuildPanel from '../../components/build_panel';

import {events, GET_BUILD} from '../../actions/events';
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
    const {owner, name, number, job} = this.props.params;
    const {repository, build, logs, state} = this.props;

    if (!build || !build.jobs) {
      return (
        <div>Loading...</div>
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

/*
<div style={{display: "none"}}>
  <Sticky top={32} enabled={true}>
    <div className="information">
      {job_.status == PENDING || job_.status == RUNNING ?
        <Button raised ripple onClick={this.handleJobCancel}>Cancel</Button> :
        <Button raised ripple onClick={this.handleJobRestart}>Restart</Button>
      }
    </div>
  </Sticky>
</div>
*/

  // handleJobCancel() {
  //   const {owner, name} = this.props.params;
  //   const {build, job} = this.props;
  //   this.props.dispatch(cancelJob(owner, name, build.number, job.number));
  // }
  //
  // handleJobRestart() {
  //   const {owner, name} = this.props.params;
  //   const {build} = this.props;
  //   this.props.dispatch(restartJob(owner, name, build.number));
  // }
}

export default branch((props, context) => {
  const {owner, name, number} = props.params;
  return {
    state: ['pages', 'build'],
    repository: ['repos', owner, name],
    build: ['builds', owner, name, number],
    logs: ['logs']
  }
}, Content);

import React from 'react';
import {branch} from 'baobab-react/higher-order';
import {Button} from 'react-mdl';

import Term from '../../components/term';

import './index.less';

import PageContent from '../../components/layout/content';
import BuildPanel from '../../components/build_panel';
import {RUNNING, PENDING} from '../../components/status';

import {events, GET_BUILD, GET_BUILD_LOGS, CLEAR_BUILD_LOGS} from '../../actions/events';
import { cancelJob, restartJob } from '../../data/jobs/actions';

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

  shouldComponentUpdate(nextProps) {
    return this.props.build != nextProps.build || this.props.logs != nextProps.logs;
  }

  componentWillReceiveProps(nextProps) {
    const {owner, name, number} = this.props.params;
    const {owner: nextOwner, name: nextName, number: nextNumber} = nextProps.params;
    if (nextOwner != owner || nextName != name || nextNumber != number) {
      events.emit(GET_BUILD, {owner, name, number});
    }
    if (nextProps.build && nextProps.build.status != 'pending' &&
      nextProps.build.status != 'running' && !nextProps.logs) {
      events.emit(GET_BUILD_LOGS, {owner, name, number, job: 1});
    }
  }

  render() {
    const {owner, name, number, job} = this.props.params;
    const {build, logs} = this.props;

    if (!build || !build.jobs) {
      return (
        <div>Loading...</div>
      );
    }

    const job_ = build.jobs[job ? job-1 : 0];

    let term = [];
    if (logs) {
      Object.keys(logs).map(function(group) {
        const lines = logs[group];
        term.push(
          <Term key={group} name={group} lines={lines}></Term>
        );
      });
    }

    return (
      <PageContent fluid className="build">



          <BuildPanel build={build} job={job_} />
          <div className="log">{term}</div>

      </PageContent>
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
    repository: ['repos', owner, name],
    build: ['builds', owner, name, number],
    logs: ['logs']
  }
}, Content);

import React from 'react';

import BuildPanel from '../../components/build_panel';
import PageContent from '../../components/layout/content';
import Term from '../../components/term';

import {RUNNING, PENDING} from '../../components/status';

import {
  events,
  GET_BUILD_LOGS,
  DEL_BUILD_LOGS,
  OPEN_LOG_STREAM,
  CLOSE_LOG_STREAM
} from '../../actions/events';

export class Results extends React.Component {

  componentDidMount() {
    const {repo, build, job, logs} = this.props;

    if (job.status == PENDING) return;
    if (job.status != RUNNING && !logs) {
      events.emit(GET_BUILD_LOGS, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.number
      });
      return;
    }

    if (job.status == RUNNING) {
      events.emit(OPEN_LOG_STREAM, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.number
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {repo, build, job, logs} = nextProps;

    if (job.status == PENDING) return;
    if (job.status != RUNNING && !logs) {
      events.emit(GET_BUILD_LOGS, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.number
      });
      return;
    }

    if (this.props.job && this.props.job.status != RUNNING && job.status == RUNNING) {
      events.emit(OPEN_LOG_STREAM, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.number
      });
    }
  }

  componentWillUnmount() {
    events.emit(CLOSE_LOG_STREAM);
    events.emit(DEL_BUILD_LOGS);
  }

  componentDidUpdate() {
    const {follow, job} = this.props;
    if (follow && job && job.status == RUNNING) {
      // HACK fix this hacky code
      const pane = document.querySelector('.mdl-layout__content');
      pane.scrollTop = pane.scrollHeight;
    }
  }

  render() {
    const {repo, build, job, logs} = this.props;

    let term = [];
    if (logs) {
      Object.keys(logs).map(function(group) {
        const lines = logs[group];
        term.push(
          <Term key={group} name={group} lines={lines}></Term>
        );
      });
    }

    var alerts = [];
    if (build.signed && !build.verified) {
      alerts.push(
        <div className="alert warning">
          <i className="material-icons">warning</i>
          <span>Unable to verify the Yaml signature.</span>
        </div>
      );
    }
    if (job.error && job.error != '') {
      alerts.push(
        <div className="alert error">
          <i className="material-icons">error_outline</i>
          <span>{job.error}</span>
        </div>
      );
    }

    return (
      <PageContent fluid className="build">
        <BuildPanel repo={repo} build={build} job={job}>{alerts}</BuildPanel>
        <div className="log">{term}</div>
      </PageContent>
    );
  }
}

import BuildPanel from '../../components/build_panel';
import {Button} from 'react-mdl';
import PageContent from '../../components/layout/content';
import React from 'react';
import Status from '../../components/status';
import Term from '../../components/term';
import {
  events,
  APPROVE_BUILD,
  DECLINE_BUILD,
  DEL_BUILD,
  POST_BUILD,
  OPEN_LOG_STREAM,
  CLOSE_LOG_STREAM,
  FOLLOW_LOGS,
  UNFOLLOW_LOGS,
  LOG_RESET,
  LOG_EXPAND,
  LOG_COLLAPSE
} from '../../actions/events';
import {RUNNING, PENDING, BLOCKED, SKIPPED} from '../../components/status';

export class Results extends React.Component {
  constructor(props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
  }

  componentDidMount() {
    const {repo, build, job} = this.props;

    if (job.state == RUNNING) {
      events.emit(OPEN_LOG_STREAM, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.pid
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {repo, build, job} = nextProps;

    if (this.props.job && this.props.job.state != RUNNING && job.state == RUNNING) {
      events.emit(OPEN_LOG_STREAM, {
        owner: repo.owner,
        name: repo.name,
        number: build.number,
        job: job.pid
      });
    }
  }

  componentWillUnmount() {
    events.emit(CLOSE_LOG_STREAM);
    events.emit(LOG_RESET);
  }

  componentDidUpdate() {
    const {follow, job} = this.props;
    if (follow && job && job.state == RUNNING) {
      // HACK fix this hacky code
      const pane = document.querySelector('.mdl-layout__content');
      pane.scrollTop = pane.scrollHeight;
    }
  }

  handleCancel() {
    const {repo, build, job} = this.props;
    events.emit(DEL_BUILD, {
      owner: repo.owner,
      name: repo.name,
      number: build.number,
      job: job.pid
    });
  }

  handleFollow() {
    events.emit(FOLLOW_LOGS);
  }

  handleUnfollow() {
    events.emit(UNFOLLOW_LOGS);
  }

  handleApprove() {
    const {repo, build} = this.props;
    events.emit(APPROVE_BUILD, {
      owner: repo.owner,
      name: repo.name,
      number: build.number
    });
  }

  handleDecline() {
    const {repo, build} = this.props;
    events.emit(DECLINE_BUILD, {
      owner: repo.owner,
      name: repo.name,
      number: build.number
    });
  }

  handleRestart() {
    const {repo, build} = this.props;
    events.emit(POST_BUILD, {
      owner: repo.owner,
      name: repo.name,
      number: build.number
    });
  }

  handleExpand(e) {
    const {repo, build} = this.props;
    const {proc, open} = e.data;

    const event = open ? LOG_EXPAND : LOG_COLLAPSE;
    events.emit(event, {
      owner: repo.owner,
      name: repo.name,
      number: build.number,
      proc: proc
    });
  }

  render() {
    const {repo, build, job, logs, follow} = this.props;

    let term = [];
    // if (logs) {
    //   Object.keys(logs).map(function(group) {
    //     const lines = logs[group];
    //     term.push(
    //       <Term key={group} name={group} lines={lines}></Term>
    //     );
    //   });
    // }

    if (logs && job && job.children) {
      for (var i=0;i < job.children.length; i++) {
        const proc = job.children[i];
        if (proc.state == PENDING || proc.state == SKIPPED) {
          continue;
        }
        const log = logs[proc.name] || { lines: [] };
        // let lines = logs && logs[proc.name] || [] : [];
        // lines = lines.length ? lines : [];
        term.push(
          <Term key={proc.name} proc={proc} lines={log.lines} open={log.open} onClick={this.handleExpand}></Term>
        );
      }
    }

    return (
      <PageContent fluid className="build">
        <BuildPanel repo={repo} build={build} job={job}>
          <details>
            <summary></summary>
            <div>
              {build.status == BLOCKED ? <Button ripple onClick={this.handleApprove}>approve</Button> : <noscript />}
              {build.status == BLOCKED ? <Button ripple onClick={this.handleDecline}>decline</Button> : <noscript />}
              {job.state == RUNNING ? <Button ripple onClick={this.handleCancel}>cancel</Button> : <noscript />}
              {build.status != BLOCKED && !follow ? <Button ripple onClick={this.handleFollow}>Follow</Button> : <noscript />}
              {build.status != BLOCKED && follow ? <Button ripple onClick={this.handleUnfollow}>Unfollow</Button> : <noscript />}
              {build.status != RUNNING && job.state != PENDING && job.state != BLOCKED ? <Button ripple onClick={this.handleRestart}>restart</Button>: <noscript />}
            </div>
          </details>
        </BuildPanel>
        {build.signed && !build.verified ?
          <div className="alert warning">
            <i className="material-icons">warning</i>
            <span>WARNING: unable to verify the Yaml signature.</span>
          </div> :
          <noscript />
        }
        {build.error && build.error != '' ?
          <div className="alert error">
            <i className="material-icons">error_outline</i>
            <span>ERROR: {build.error}</span>
          </div> :
          <noscript />
        }
        {job.error && job.error != '' ?
          <div className="alert error">
            <i className="material-icons">error_outline</i>
            <span>ERROR: {job.error}</span>
          </div> :
          <noscript />
        }
        {build.status === 'declined' ?
          <div className="alert error">
            <i className="material-icons">error_outline</i>
            <span>Build declined by {build.approved_by}</span>
          </div> :
          <noscript />
        }
        <div className="log">{term}</div>
        {job.state == RUNNING ?
          (
            <div className="build-toolbar">
              <Status state={job.state} />
              <Button ripple onClick={this.handleCancel}>Cancel</Button>
              {!follow ? <Button ripple onClick={this.handleFollow}>Follow</Button> : <noscript />}
              {follow ? <Button ripple onClick={this.handleUnfollow}>Unfollow</Button> : <noscript />}
            </div>
          ) : <noscript/>
        }
      </PageContent>
    );
  }
}

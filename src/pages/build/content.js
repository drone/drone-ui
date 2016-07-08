import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import Sticky from 'react-stickynode';

import './index.less';

import PageContent from '../../components/layout/content';
import BuildPanel from '../../components/build_panel';
import Log from './log';
import {RUNNING, PENDING} from '../../components/status';

import { getBuild } from '../../data/builds/actions';
import { cancelJob, restartJob } from '../../data/jobs/actions';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.handleJobCancel = this.handleJobCancel.bind(this);
    this.handleJobRestart = this.handleJobRestart.bind(this);
  }

  componentDidMount() {
    const {owner, name, number} = this.props.params;

    this.props.dispatch(getBuild(owner, name, number));
  }

  render() {
    const {owner, name} = this.props.params;
    const {build, job} = this.props;

    if (build == null || job == null) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <PageContent fluid className="build">

          <div style={{display: 'none'}}>
            <Sticky top={32} enabled={true}>
              <div className="information">
                {job.get('status') == PENDING || job.get('status') == RUNNING ?
                  <Button raised ripple onClick={this.handleJobCancel}>Cancel</Button> :
                  <Button raised ripple onClick={this.handleJobRestart}>Restart</Button>
                }
              </div>
            </Sticky>
          </div>

            <BuildPanel build={build} job={job}/>
            <div className="log">
              <Log owner={owner} name={name} build={build} job={job}/>
            </div>

      </PageContent>
    );
  }

  handleJobCancel() {
    const {owner, name} = this.props.params;
    const {build, job} = this.props;
    this.props.dispatch(cancelJob(owner, name, build.get('number'), job.get('number')));
  }

  handleJobRestart() {
    const {owner, name} = this.props.params;
    const {build} = this.props;
    this.props.dispatch(restartJob(owner, name, build.get('number')));
  }
}

export default connect(
  (state, ownProps) => {
    const build = state.drone.builds.find((build) => {
      return build.get('number') == ownProps.params.number;
    });

    let job = null;
    if (build && build.has('jobs')) {
      job = state.drone.jobs.get(build.get('jobs').first().toString());
    }

    return {build, job};
  }
)(Content);

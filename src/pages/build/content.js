import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Sticky from 'react-stickynode';

import Row from '../../components/grid/row';
import Col from '../../components/grid/col';
import PageContent from '../../components/layout/content';
import Status from '../../components/status';
import BuildMeta from '../../components/build_meta';
import Log from './log';

import { getBuild } from '../../data/builds/actions';

class Content extends React.Component {
  componentDidMount() {
    const {owner, name, number} = this.props.params;

    this.props.dispatch(getBuild(owner, name, number)); // TODO: Add setInterval to check every minute
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
        <Row>
          <Col xs={12} sm={4} lg={3}>
            <Sticky top={32} enabled={true}>
              <h3>
                {build.get('message').trim()}
                <a className="material-icons" href={build.get('link_url')} target="_blank">link</a>
              </h3>
              <BuildMeta build={build}/>
              <hr/>
              <Status state={build.get('status')}/>
              <p>finished {moment(build.get('finished_at') * 1000).fromNow()}</p>
              <p>with exit code {job.get('exit_code')}</p>
              <hr/>
            </Sticky>
          </Col>
          <Col xs={12} sm={8} lg={9}>
            <div className="log">
              <Log owner={owner} name={name} build={build.get('number')} job={job.get('number')}/>
            </div>
          </Col>
        </Row>
      </PageContent>
    );
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

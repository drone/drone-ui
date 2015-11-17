import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo } from "../../../actions";
import { fetchBuild, fetchLogs } from "../../../actions/build_actions";
import { JobList } from "../../../components/job_list";
import Sticky from "react-stickynode";
import moment from "moment";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name, number, job, repo} = this.props;
    if (shouldFetch(owner, name, repo)) {
      dispatch(fetchRepo(owner, name));
    }
    dispatch(fetchBuild(owner, name, number))
    dispatch(fetchLogs(owner, name, number, job))
  }

  render() {
    const {build, repo, job} = this.props;
    if (!build) {
      return (
        <div>Loading</div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <Sticky enabled={true} top={50}>
              <div className="build-summary">
                <div>
                  <h3>
                    <span>{build.message}</span>
                    <a className="material-icons" href={build.link_url} target="_blank">link</a>
                  </h3>
                </div>
                <p>
                  <em>{build.author}</em>
                  <span>authored</span>
                  <em>{moment(new Date(build.created_at*1000)).fromNow()}</em>
                  <span>to</span>
                  <em>{build.branch}</em>
                </p>
              </div>
              <JobList repo={repo} build={build} active={job} />
              <div className="build-btn-group">
                <button className="btn btn-info hidden" id="restart">restart</button>
                <button className="btn btn-info hidden" id="cancel">cancel</button>
              </div>
            </Sticky>
          </div>
          <div className="col-md-8">
            <pre id="output"></pre>
            <button className="tail" id="tail">
              <i className="material-icons">expand_more</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function shouldFetch(owner, name, repo) {
  return !repo || repo.owner !== owner || repo.name !== name;
}

function mapStateToProps(state) {
  const { repo, build, router } = state;
  const { owner, name, number, job } = router.params;
  return {
  	build: build.item,
    repo: repo.repo,
    owner,
    name,
    number,
    job: parseInt(job) || 1,
  }
}

Page.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.number,
  job: PropTypes.number,
  repo: PropTypes.object,
  build: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);

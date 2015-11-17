import React, { Component, PropTypes } from 'react'
import { JobListItem } from "./job_list_item";

export class JobList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading || !this.props.build || !this.props.build.jobs) {
      return (
        <div>Loading Jobs</div>
      );
    }

    var jobs = [];
    var {build, active, repo} = this.props;
    this.props.build.jobs.forEach(function(job) {
      jobs.push(<JobListItem repo={repo} build={build} job={job} active={active} key={job.number} />);
    });

    return (
      <div className="job-list">
        {jobs}
      </div>
    );
  }
}

JobList.props = {
  loading: PropTypes.bool,
  active: PropTypes.number,
  build: PropTypes.object,
  repo: PropTypes.object
}

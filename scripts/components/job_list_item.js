import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import moment from "moment";

export class JobListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { repo, build, job, active } = this.props;
    const link = `/${repo.full_name}/${build.number}/${job.number}`;

    var env;
    if (build.jobs.length !== 1) {
      var envs = [];
      for(var key in job.environment) {
      	var text=`${key}=${job.environment[key]}`;
        envs.push(<div className="env" key={text}>{text}</div>);
      }
      env = (
      	<h3>{envs}</h3>
      );
    }

    var detail;
    switch (job.status) {
    case "pending":
      detail = (
        <div>
          {env}
          <div className="msg-pending">
            enqueued 
            <span>{moment(new Date(job.enqueued_at*1000)).fromNow()}</span>
          </div>
        </div>
      )
      break
    case "started":
      detail = (
        <div>
          {env}
          <div className="msg-running">
            started 
            <span>{moment(new Date(job.started_at*1000)).fromNow()}</span>
          </div>
        </div>
      )
      break
    default:
      detail = (
        <div>
          {env}
          <div className="msg-finished">
            finished 
            <span>{moment(new Date(job.finished_at*1000)).fromNow()}</span>
          </div>
          <div className="msg-exited">
            with exit code
            <span>{job.exit_code}</span>
          </div>
        </div>
      )
    }

    return (
      <Link className={job.number===active?"active":""} to={link}>
        <div>
          <div className={"status "+job.status}>{job.status}</div>
        </div>
        {detail}
      </Link>
    );
  }
}

JobListItem.props = {
	repo: PropTypes.object,
	build: PropTypes.object,
	job: PropTypes.job,
	active: PropTypes.number
}

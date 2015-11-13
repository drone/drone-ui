import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import moment from "moment";

export class BuildListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { repo, build } = this.props;
    const link = `/${repo.full_name}/${build.number}`;
    const style = `status ${build.status}`;

    return (
      <Link className="card" to={link}>
        <div className="card-header">
          <img src={build.author_avatar} />
        </div>
        <div className="card-block">
          <div>
            <div className={style}>{build.status}</div>
            <h3>{build.message}</h3>
          </div>
          <p className="card-text">
            <em>{build.author}</em>
            <span>authored</span>
            <em>{moment(new Date(build.created_at*1000)).fromNow()}</em>
            <span>to</span>
            <em>{build.branch}</em>
          </p>
        </div>
      </Link>
    );
  }
}

BuildListItem.props = {
	repo: PropTypes.object,
	build: PropTypes.object
}

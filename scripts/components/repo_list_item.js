import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export class RepoListItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { repo } = this.props;
    const link = `/${repo.full_name}`;

    return (
      <Link className="col-sm-4" to={link}>
        <div className="card">
          <div className="card-header">
            <img className="avatar" src={repo.avatar_url} />
          </div>
          <div className="card-block">
            <h3>{repo.full_name}</h3>
            <p>{repo.clone_url}</p>
          </div>
        </div>
      </Link>
    );
  }
}

RepoListItem.props = {
	repo: PropTypes.object,
}

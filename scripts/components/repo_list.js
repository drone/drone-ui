import React, { Component, PropTypes } from 'react'
import { RepoListItem } from "./repo_list_item";

export class RepoList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading) {
      return (
        <div>Loading Repos</div>
      );
    }

    // renders an empty list message
    if (this.props.repos.length === 0) {
      return (
        <div>No Repos</div>
      );
    }

    var repos = [];
    this.props.repos.forEach(function(repo) {
      repos.push(<RepoListItem repo={repo} key={repo.full_name} />);
    });

    return (
      <div className="row row-repo">
        {repos}
      </div>
    );
  }
}

RepoList.props = {
  filter: PropTypes.string,
  loading: PropTypes.bool,
  repos: PropTypes.array
}

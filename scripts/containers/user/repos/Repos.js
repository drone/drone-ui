import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepoList } from "../../../actions";
import { RepoList } from "../../../components/repo_list";

class Repos extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchRepoList());
  }

  render() {
    return (
      <div className="container">
        <RepoList repos={this.props.repos} loading={this.props.loading} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    loading: state.repos.loading,
    repos: state.repos.list
  }
}

Repos.props = {
  repos: PropTypes.array,
  loading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Repos)
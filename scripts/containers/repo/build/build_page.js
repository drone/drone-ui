import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo } from "../../../actions";
import { fetchBuild } from "../../../actions/build_actions";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name, number, repo} = this.props;
    if (shouldFetch(owner, name, repo)) {
      dispatch(fetchRepo(owner, name));
      dispatch(fetchBuild(owner, name, number))
    }
  }

  render() {
    return (
      <div className="container">
        <h1>BUILD</h1>
      </div>
    );
  }
}

function shouldFetch(owner, name, repo) {
  return !repo || repo.owner !== owner || repo.name !== name;
}

function mapStateToProps(state) {
  console.log(state)
  const { repo, build, router } = state;
  const { owner, name, number, job } = router.params;
  return {
  	build: build.item,
    repo: repo.repo,
    owner,
    name,
    number,
    job: job || 1,
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

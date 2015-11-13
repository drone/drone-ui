import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo } from "../../../actions";
import { fetchBuildList } from "../../../actions/build_actions";
import { BuildList } from "../../../components/build_list";

class Builds extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name} = this.props.router.params;
    dispatch(fetchRepo(owner, name));
    dispatch(fetchBuildList(owner, name));
  }

  render() {
    const {repo, builds, loading} = this.props;
    return (
      <div className="container">
        <BuildList repo={repo} builds={builds} loading={loading} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    router: state.router,
    repo: state.repo.repo,
    builds: state.builds.items,
    loading: state.builds.loading
  }
}

Builds.props = {
  router: PropTypes.object,
  repo: PropTypes.object,
  builds: PropTypes.array,
  loading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Builds);

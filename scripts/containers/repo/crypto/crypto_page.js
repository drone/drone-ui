import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo } from "../../../actions";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name} = this.props;
    dispatch(fetchRepo(owner, name));
  }

  render() {
    return (
      <div className="container repo_secrets">
        <div>
          <textarea className="secrets" spellcheck="false"></textarea>
          <div className="alert alert-danger hidden"></div>
          <button className="btn btn-info" id="encryptButton">Generate</button>
        </div>
        <div>
          <pre className="result"></pre>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { repo, router } = state;
  const { owner, name } = router.params;
  return {
    owner,
    name,
    repo,
  }
}

Page.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  repo: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);
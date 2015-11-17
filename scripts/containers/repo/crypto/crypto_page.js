import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo, postRepoSecret } from "../../../actions";

class Page extends Component {
  constructor(props) {
    super(props);

    this.encryptSecrets = this.encryptSecrets.bind(this);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name, repo} = this.props;
    if (shouldFetch(owner, name, repo)) {
      dispatch(fetchRepo(owner, name));
    }
  }

  encryptSecrets(e) {
    const {dispatch} = this.props;
    const {owner, name} = this.props;
    dispatch(postRepoSecret(owner, name, e.target.value));
  }

  render() {

    return (
      <div className="container repo_secrets">
        <div>
          <textarea className="secrets" spellCheck="false"></textarea>
          <div className={this.props.secret.error?"alert alert-danger":"alert alert-danger hidden"}>
            {this.props.secret.error}
          </div>
          <button className="btn btn-info" onClick={this.encryptSecrets}>Encrypt</button>
        </div>
        <div className={this.props.secret.text?"":"hidden"}>
          <pre className="result">{this.props.secret.text}</pre>
        </div>
      </div>
    );
  }
}

function shouldFetch(owner, name, repo) {
  return !repo || repo.owner !== owner || repo.name !== name;
}

function mapStateToProps(state) {
  const { repo, router } = state;
  const { owner, name } = router.params;
  return {
    repo: repo.repo,
    secret: repo.secret,
    owner,
    name,
  }
}

Page.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  repo: PropTypes.object,
  secret: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);
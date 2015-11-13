import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo, patchRepoDebounce, fetchRepoKey, patchRepo } from "../../../actions";


class Page extends Component {
  constructor(props) {
    super(props);

    this.togglePush = this.togglePush.bind(this);
    this.toggleTags = this.toggleTags.bind(this);
    this.toggleDeploys = this.toggleDeploys.bind(this);
    this.toggleTrusted = this.toggleTrusted.bind(this);
    this.togglePullRequest = this.togglePullRequest.bind(this);
    this.changeTimeout = this.changeTimeout.bind(this);
    this.update = this.update.bind(this);
    this.updateThrottle = this.updateThrottle.bind(this);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name} = this.props;
    dispatch(fetchRepo(owner, name));
    dispatch(fetchRepoKey(owner, name));
  }

  togglePush() {
    this.update({allow_push: !this.props.repo.allow_push });
  }

  togglePullRequest() {
    this.update({allow_pr: !this.props.repo.allow_pr });
  }

  toggleTags() {
    this.update({allow_tag: !this.props.repo.allow_tags });
  }

  toggleDeploys() {
    this.update({allow_deploy: !this.props.repo.allow_deploys });
  }

  toggleTrusted() {
    this.update({trusted: !this.props.repo.trusted });
  }

  changeTimeout(e) {
    const dur = e.target.valueAsNumber || parseInt(e.target.value);
    console.log(dur)
    this.update({timeout: dur});
  }

  update(data) {
    const {owner, name, dispatch} = this.props;
    dispatch(patchRepo(owner, name, data));
  }

  updateThrottle(data) {
    const {owner, name, dispatch} = this.props;
    dispatch(patchRepoDebounce(owner, name, data));
  }

  render() {
    const {repo, user, keys} = this.props;

    var adminRow = "row hidden";
    if (user && user.admin) {
      adminRow = "row";
    }

    return (
      <div id="content">
        <div className="container repo_config">
          <div className="row">
            <div className="col-md-3">Push Hooks</div>
            <div className="col-md-9">
              <input checked={repo.allow_push} hidden="hidden" id="push" type="checkbox" onChange={this.togglePush} />
              <label className="switch" htmlFor="push"></label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">Pull Request Hooks</div>
            <div className="col-md-9">
              <input checked={repo.allow_pr} hidden="hidden" id="pull" type="checkbox" onChange={this.togglePullRequest} />
              <label className="switch" htmlFor="pull"></label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">Tag Hooks</div>
            <div className="col-md-9">
              <input checked={repo.allow_tags} hidden="hidden" id="tag" type="checkbox" onChange={this.toggleTags} />
              <label className="switch" htmlFor="tag"></label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">Deploy Hook</div>
            <div className="col-md-9">
              <input checked={repo.allow_deploys} hidden="hidden" id="deploy" type="checkbox" onChange={this.toggleDeploys} />
              <label className="switch" htmlFor="deploy"></label>
            </div>
          </div>
          <div className={adminRow}>
            <div className="col-md-3">Timeout in Minutes</div>
            <div className="col-md-9">
              <input max="900" min="0" type="range" value={repo.timeout} onChange={this.changeTimeout} />
              <span className="timeout-label">{repo.timeout} minutes</span>
            </div>
          </div>
          <div className={adminRow}>
            <div className="col-md-3">Trusted</div>
            <div className="col-md-9">
              <input checked={repo.trusted} hidden="hidden" id="trusted" type="checkbox" onChange={this.toggleTrusted} />
              <label className="switch" htmlFor="trusted"></label>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">Public Key</div>
            <div className="col-md-9">
              <pre>{keys.public || ""}</pre>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="alert alert-danger">
                <button className="btn btn-danger">Delete</button>
                <span>Permanently deletes the build history. This action cannot be undone.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { repo, user, router } = state;
  const { owner, name } = router.params;

  return {
    repo: repo.repo,
    keys: repo.keys,
    user,
    owner,
    name,
  }
}

Page.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  repo: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);

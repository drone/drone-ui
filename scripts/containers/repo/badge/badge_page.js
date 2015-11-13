import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchRepo } from "../../../actions";
import { BadgeList } from "../../../components/badge_list";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    const {owner, name, repo} = this.props;
    if (shouldFetch(owner, name, repo)) {
      dispatch(fetchRepo(owner, name));
    }
  }

  render() {
    const {protocol, hostname} = this.props.location;
    const {owner, name} = this.props;
    return (
      <div className="container centered">
        <BadgeList protocol={protocol} hostname={hostname} owner={owner} name={name} />
      </div>
    );
  }
}

function shouldFetch(owner, name, repo) {
  return !repo || repo.owner !== owner || repo.name !== name;
}

function mapStateToProps(state) {
  const { repo, router, location } = state;
  const { owner, name } = router.params;
  return {
    repo: repo.repo,
    location,
    owner,
    name
  }
}

Page.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  repo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);

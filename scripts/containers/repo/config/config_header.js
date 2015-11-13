import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {owner, name} = this.props;
    const link = `/${owner}/${name}`;
    return (
      <div className="subnav">
        <div className="container-fluid">
          <ol>
            <li>
              <Link to={link}>{owner} / {name}</Link>
            </li>
          </ol>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to={link}>Builds</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={link+"/settings/badges"}>Badges</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={link+"/settings/encrypt"}>Secrets</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to={link+"/settings"}>Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Header.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
}

function mapStateToProps(state) {
  const { repo, router } = state;
  return {
    owner: router.params.owner,
    name: router.params.name,
  }
}

export default connect(mapStateToProps)(Header)
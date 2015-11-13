import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {owner, name, number} = this.props;
    const link = `/${owner}/${name}`;
    return (
      <div className="subnav">
        <div className="container-fluid">
          <ol>
            <li>
              <Link to={link}>{owner} / {name}</Link>
            </li>
            <li className="separator">
              <i className="material-icons">chevron_right</i>
            </li>
            <li>{number}</li>
          </ol>
        </div>
      </div>
    );
  }
}

Header.props = {
  owner: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.PropTypes
}

function mapStateToProps(state) {
  const { router } = state;
  return {
    owner: router.params.owner,
    name: router.params.name,
    number: router.params.number
  }
}

export default connect(mapStateToProps)(Header)
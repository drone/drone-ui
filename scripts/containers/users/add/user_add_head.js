import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="subnav">
        <div className="container-fluid">
          <ol>
            <li><Link to="/system/users">Users</Link></li>
          </ol>
        </div>
      </div>
    );
  }
}

Header.props = {}

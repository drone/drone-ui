import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="subnav">
        <div className="container-fluid">
          <ol>
            <li>Account Profile</li>
          </ol>
        </div>
      </div>
    );
  }
}

Header.props = {}

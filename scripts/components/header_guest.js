import React, { Component, PropTypes } from 'react'
import { Link, IndexLink } from "react-router";

export default class HeaderGuest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className="navbar">
        <div className="container-fluid">
          <IndexLink className="navbar-brand" to="/login"></IndexLink>
        </div>
      </nav>
    );
  }
}

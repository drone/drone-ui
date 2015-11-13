import React, { Component, PropTypes } from "react";

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="subnav">
        <div className="container-fluid">
          <ol>
            <li>Repository List</li>
          </ol>
        </div>
      </div>
    )
  }
}

Header.props = {}

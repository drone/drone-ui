import React, { Component, PropTypes } from 'react'
import { Link, IndexLink } from "react-router";
import { Typeahead } from "./typeahead";

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className="navbar">
        <div className="container-fluid">
          <IndexLink className="navbar-brand" to="/"></IndexLink>
 
          <ul className="nav navbar-nav navbar-right">
            <li>
              <form className="navbar-form">
                <Typeahead placeholder="Search..." />
              </form>
            </li>
            <li>
              <img src={this.props.user.avatar_url} />
            </li>
            <li>
              <div className="dropdown">
                <button data-toggle="dropdown" type="button">
                  <i className="material-icons">expand_more</i>
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link className="dropdown-item" to="/account/profile">Profile</Link>
                  <Link className="dropdown-item" to="/account/repos">Repos</Link>
                  <Link className="dropdown-item" to="/system/users">People</Link>
                  <Link className="dropdown-item" to="/system/nodes">Nodes</Link>
                  <Link className="dropdown-item" to="/logout">Logout</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

Header.props = {
	user: PropTypes.object,
}

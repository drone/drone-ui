import React, { Component, PropTypes } from 'react'
import { Link, IndexLink } from "react-router";

export class UserItem extends Component {
  constructor(props) {
    super(props)

    this.handleToggle = this.handleToggle.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleToggle() {
    this.props.onToggle(this.props.user);
  }

  handleDelete() {
    this.props.onDelete(this.props.user);
  }

  render() {
    var label = null;
    if (this.props.user.admin) {
      label = <small>Admin</small>;
    }

    return (
      <div className="col-sm-4">
        <div className="card">
          <div className="card-header">
            <img className="avatar" src={this.props.user.avatar_url} />
          </div>
          <div className="card-block">
            <h3 className="login">{this.props.user.login}{label}</h3>
            <p className="email card-text">{this.props.user.email}</p>
            <div className="btn-group">
              <button className="btn btn-info" onClick={this.handleToggle}>Toggle Admin</button>
              <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserItem.props = {
	user: PropTypes.object,
  onToggle: PropTypes.function,
  onDelete: PropTypes.function
}

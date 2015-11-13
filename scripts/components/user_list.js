import React, { Component, PropTypes } from 'react'
import { UserItem } from "./user_list_item";

export class UserList extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    // renders a loading message
    if (this.props.loading) {
      return (
        <div>Loading Users</div>
      );
    }

    // renders an empty list message
    if (this.props.users.length === 0) {
      return (
        <div>No Users</div>
      );
    }

    var users = [];
    this.props.users.forEach(function(user) {
      users.push(<UserItem user={user} key={user.login}/>);
    });
    return (
      <div className="row row-user">
        {users}
      </div>
    );
  }
}

UserList.props = {
	users: PropTypes.array,
  loading: PropTypes.bool
}

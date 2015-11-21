import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchUserList, deleteUser, patchUser } from "../../actions/user_actions";
import { UserList } from "../../components/user_list";
import { Link } from "react-router";

class Page extends Component {
  constructor(props) {
    super(props)

    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserList());
  }

  handleDelete(user) {
    var remove = confirm(`Are you sure you want to remove ${user.login}?`);
    if (!remove) {
      return false;
    }

    const { dispatch } = this.props;
    dispatch(deleteUser(user));
  }

  handleToggle(user) {
    const { dispatch } = this.props;
    user.admin = !user.admin;
    dispatch(patchUser(user));
  }

  render() {
    return (
      <div className="container">
        <div className="toolbar">
          <Link className="btn btn-info" to="/system/users/add">New User</Link>
        </div>
        <UserList users={this.props.users} loading={this.props.loading} onDelete={this.handleDelete} onToggle={this.handleToggle} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.users.loading,
    users: state.users.list
  }
}

Page.props = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)
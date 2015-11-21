import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { postUser } from "../../../actions/user_actions";
import { Link } from "react-router";

class Page extends Component {
  constructor(props) {
    super(props)

    this.addUser = this.addUser.bind(this);
  }

  addUser() {
    const {dispatch} = this.props;
    let user = {
      login: this.refs.login.value,
      avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm",
    };
    dispatch(postUser(user));
  }

  render() {
    const {status} = this.props;

    var message = (
      <div className="alert alert-info">
        this is some text explaining this page
      </div>
    );

    if (status.isError) {
      message = (
        <div className="alert alert-danger">
          There was an error adding the user.
        </div>
      );
    }
    if (status.isSuccess) {
      message = (
        <div className="alert alert-success">
          Successfully added the user. <Link to="/system/users">Return</Link> to the user list.
        </div>
      );
    }

    return (
      <div className="container">
        {message}
        <form>
          <input ref="login" placeholder="octocat" />
          <button type="button" onClick={this.addUser}>Add User</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.status
  }
}

Page.props = {
  status: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)
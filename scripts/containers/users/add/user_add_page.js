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

    var message = (
      <div className="alert alert-info">
        this is some text explaining this page
      </div>
    );
    if (this.props.alerts.danger) {
      console.log(this.props.alerts.danger)
      message = (
        <div className="alert alert-danger">
          {this.props.alerts.danger}
        </div>
      );
    }
    if (this.props.alerts.success) {
      message = (
        <div className="alert alert-success">
          successfully added some user. add another or <Link to="/system/users">go back</Link> to the user list
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
  console.log(state)
  return {
    alerts: state.users.alerts
  }
}

Page.props = {
  alerts: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page)
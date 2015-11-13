import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchUserToken } from "../../../actions/user_actions";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {login, email, token} = this.props.user;
    const {dispatch} = this.props;

    var tokenEl = (
      <button className="btn btn-info" onClick={() => {
        dispatch(fetchUserToken());
      }}>Show Token</button>
    );

    if (token) {
      tokenEl = <pre>{token}</pre>;
    }
    return (
      <div className="container centered">
        <div className="badge-list">
          <div className="row">
            <div className="col-md-3">Login</div>
            <div className="col-md-9">{login}</div>
          </div>
          <div className="row">
            <div className="col-md-3">Email</div>
            <div className="col-md-9">{email}</div>
          </div>
          <div className="row">
            <div className="col-md-3">Token</div>
            <div className="col-md-9">{tokenEl}</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

Page.props = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(Page);

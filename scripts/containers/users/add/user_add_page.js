import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { fetchUserList } from "../../../actions/user_actions";
import { UserList } from "../../../components/user_list";

class Page extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserList());
  }

  render() {
    return (
      <div className="container">
        ADD USER
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
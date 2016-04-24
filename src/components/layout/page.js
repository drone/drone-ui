import React from 'react';
import { connect } from 'react-redux';

import {Cell} from 'react-mdl';

import Header from './header';
import Subnav from './subnav';

import { fetchWindowUser } from '../../data/user/actions';

class Page extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchWindowUser());
  }

  render() {
    const {pageHead, pageContent, user} = this.props;

    if (user == null) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="page">
        <Header user={user}/>
        <Subnav>
          {pageHead}
        </Subnav>
        <hr/>
        {pageContent}
      </div>
    );
  }
}

export default connect(
  (state) => {
    if (state.drone.users.size == 0) {
      return {};
    }

    const userID = state.drone.users.get('user_id');
    return {
      user: state.drone.users.get('entities').get(userID.toString())
    };
  }
)(Page);

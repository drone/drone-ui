import React from 'react';
import { connect } from 'react-redux';

import Header from './header/index';
import Breadcrumb from './breadcrumb';
import Content from './content';

import { fetchWindowUser } from '../user/actions';

class Page extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchWindowUser()); // TODO move to another global component
  }

  render() {
    const {user} = this.props;

    return (
      <div>
        <Header user={user}/>
        <Breadcrumb/>
        <hr/>
        <Content>
        </Content>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.drone.user
  })
)(Page)

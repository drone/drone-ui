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
    return (
      <div>
        <Header/>
        <Breadcrumb/>
        <hr/>
        <Content>
          hello world
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

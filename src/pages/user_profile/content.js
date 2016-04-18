import React from 'react';
import { connect } from 'react-redux';

import './index.less';

import PageContent from '../../components/layout/content';
import Row from '../../components/grid/row';
import Col from '../../components/grid/col';
import Button from '../../components/button';

class Content extends React.Component {
  render() {
    let {user} = this.props;

    return (
      <PageContent className="user-profile">
        <Row>
          <Col xs={12} sm={3}>Login</Col>
          <Col xs={12} sm={9}>
            {user.get('login')}
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12} sm={3}>Email</Col>
          <Col xs={12} sm={9}>
            {user.get('email')}
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12} sm={3}>Token</Col>
          <Col xs={12} sm={9}>
            <Button onClick={this.handleShowToken}>Show Token</Button>
          </Col>
        </Row>
      </PageContent>
    );
  }

  handleShowToken(event) {
    console.log(event);
  }
}

export default connect(
  state => ({
    user: state.drone.user
  })
)(Content);

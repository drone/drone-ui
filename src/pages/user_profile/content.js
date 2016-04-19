import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';

import './index.less';

import PageContent from '../../components/layout/content';
import Row from '../../components/grid/row';
import Col from '../../components/grid/col';
import Button from '../../components/button';

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ''
    };

    this.handleShowToken = this.handleShowToken.bind(this);
  }

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
            {this.state.token == '' ?
              <Button onClick={this.handleShowToken}>Show Token</Button> :
              <pre>{this.state.token}</pre>
            }
          </Col>
        </Row>
      </PageContent>
    );
  }

  handleShowToken() {
    Request.post(`/api/user/token`)
      .end((err, response) => {
        if (err != null) {
          console.error(err); // TODO: Add ui error handling
        }

        this.setState({
          token: response.text
        });
      });
  }
}

export default connect(
  state => ({
    user: state.drone.user
  })
)(Content);

import React from 'react';
import { connect } from 'react-redux';
import Request from 'superagent';
import { Grid, Cell, Button } from 'react-mdl';

import './index.less';

import PageContent from '../../components/layout/content';

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
        <Grid>
          <Cell phone={12} col={3}>Login</Cell>
          <Cell phone={12} col={9}>
            {user.get('login')}
          </Cell>
        </Grid>

        <hr/>

        <Grid>
          <Cell phone={12} col={3}>Email</Cell>
          <Cell phone={12} col={9}>
            {user.get('email')}
          </Cell>
        </Grid>

        <hr/>

        <Grid>
          <Cell phone={12} col={3}>Token</Cell>
          <Cell phone={12} col={9}>
            {this.state.token == '' ?
              <Button raised ripple onClick={this.handleShowToken}>Show Token</Button> :
              <pre>{this.state.token}</pre>
            }
          </Cell>
        </Grid>
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

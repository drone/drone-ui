import React from 'react';
import { Link } from 'react-router';
import { Grid, Cell, IconButton, Textfield } from 'react-mdl';

import './index.less';

import Avatar from '../../avatar';

export default
class Header extends React.Component {
  render() {
    const {user} = this.props;

    return (
      <header className="header">
        <Grid>
          <Cell phone={2} tablet={4} col={6}>
            <Link to="/">
              <Avatar className="logo" src="/static/drone.svg"/>
            </Link>
          </Cell>
          <Cell phone={2} tablet={4} col={6} className="header-right">
            <Textfield label="Search..."/>
            <Link to="/account/profile">
              <Avatar src={user.get('avatar_url')} circle/>
            </Link>
            <IconButton name="more_vert"/>
          </Cell>
        </Grid>
      </header>
    );
  }
}

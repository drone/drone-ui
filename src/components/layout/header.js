import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Grid, Cell, IconButton, Menu, MenuItem } from 'react-mdl';

import './header.less';

import Avatar from '../avatar';

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
            <Link to="/settings">
              <Avatar src={user.get('avatar_url')} circle/>
            </Link>
            <div style={{display: 'inline-block', position: 'relative'}}>
              <IconButton name="more_vert" id="drone-header-menu-right"/>
              <Menu target="drone-header-menu-right" align="right">
                <MenuItem onClick={() => {browserHistory.push('/');}}>Builds</MenuItem>
                <MenuItem onClick={() => {browserHistory.push('/account');}}>Account</MenuItem>
                <MenuItem>Logout</MenuItem>
              </Menu>
            </div>
          </Cell>
        </Grid>
      </header>
    );
  }
}

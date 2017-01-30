import Avatar from '../avatar';
import {branch} from 'baobab-react/higher-order';
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {events, CLEAR_TOAST} from '../../actions/events';
import {Layout, Header, Drawer, Navigation, Content, IconButton, Menu, MenuItem, Snackbar} from 'react-mdl';

import './page.less';

class Page extends React.Component {
  handleTimeout() {
    events.emit(CLEAR_TOAST);
  }

  render() {
    const {pageHead, pageContent, pageToolbar, pageSidebar, user, state} = this.props;

    var pageMenu;
    if (user && user != null) {
      pageMenu = (
        <div>
          <Avatar src={user.avatar_url} circle/>
          <IconButton name="more_vert" id="drone-header-menu-right"/>
          <Menu target="drone-header-menu-right" align="right">
            <MenuItem onClick={() => {browserHistory.push('/');}}>Dashboard</MenuItem>
            <MenuItem onClick={() => {browserHistory.push('/account');}}>Account</MenuItem>
            <MenuItem onClick={() => {window.location.href='/logout';}}>Logout</MenuItem>
          </Menu>
        </div>
      );
    }

    return (
      <div style={{minHeight: '100vh', position: 'relative'}}>
          <Snackbar active={state.toast !== undefined} onTimeout={this.handleTimeout}>{state.toast}</Snackbar>
          <Layout fixedHeader fixedDrawer>
              <Header>
                <div>{pageHead}</div>
                {pageMenu}
              </Header>
              <Drawer>
                <div className="brand">
                  <Link to="/">
                      <img className="logo" src="/static/drone.svg"/>
                  </Link>
                </div>
                <Navigation>
                  {pageSidebar}
                </Navigation>
              </Drawer>
              <Content>
                {pageToolbar}
                <div className="content">
                  {pageContent}
                </div>
              </Content>
          </Layout>
      </div>
    );

    // return (
    //   <div className="page">
    //     <Header user={user}/>
    //     <Subnav>
    //       {pageHead}
    //     </Subnav>
    //     <hr/>
    //     {pageContent}
    //   </div>
    // );
  }
}

export default branch({
  user: ['user'],
  state: ['pages']
}, Page);

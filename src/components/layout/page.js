import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';

// import Header from './header';
import Subnav from './subnav';
import Avatar from '../avatar';

import { Layout, Header, Textfield, Drawer, Navigation, Content, IconButton, Menu, MenuItem} from 'react-mdl';

import { fetchWindowUser } from '../../data/users/actions';

import './page.less';

class Page extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchWindowUser());
  }

  render() {
    const {pageHead, pageContent, pageToolbar, pageSidebar, user} = this.props;

    var pageMenu;
    if (user && user != null) {
      pageMenu = (
        <div>
          <Avatar src={user.get('avatar_url')} circle/>
          <IconButton name="more_vert" id="drone-header-menu-right"/>
          <Menu target="drone-header-menu-right" align="right">
            <MenuItem onClick={() => {browserHistory.push('/')}}>Dashboard</MenuItem>
            <MenuItem onClick={() => {browserHistory.push('/account')}}>Account</MenuItem>
            <MenuItem onClick={() => {window.location.href='/logout'}}>Logout</MenuItem>
          </Menu>
        </div>
      );
    }

    return (
      <div style={{minHeight: '100vh', position: 'relative'}}>
          <Layout fixedHeader fixedDrawer>
              <Header>
                <div>{pageHead}</div>
                {pageMenu}
              </Header>
              <Drawer>
                <div className="brand">
                  <Link to="/">
                      <Avatar className="logo" src="/static/drone.svg"/>
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

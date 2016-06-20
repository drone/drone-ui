import React from 'react';
import { connect } from 'react-redux';

// import Header from './header';
import Subnav from './subnav';

import { Layout, Header, Textfield, Drawer, Navigation, Content } from 'react-mdl';

import { fetchWindowUser } from '../../data/users/actions';

import './page.less';

class Page extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchWindowUser());
  }

  render() {
    const {pageHead, pageContent, pageToolbar, user} = this.props;

    if (user == null) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div style={{minHeight: '100vh', position: 'relative'}}>
          <Layout fixedHeader fixedDrawer>
              <Header>
                {pageHead}
              </Header>
              <Drawer>
                <div>LOGO</div>
                  <Navigation>
                      <a href="">Link</a>
                      <a href="">Link</a>
                      <a href="">Link</a>
                      <a href="">Link 111</a>
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

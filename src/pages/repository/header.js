import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb from '../../components/layout/breadcrumb';
import { Tabs, Tab }from '../../components/layout/tabs';

class Header extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    const tabs = [
      {url: `/${owner}/${name}`, text: 'Builds'},
      {url: `/${owner}/${name}/settings/badges`, text: 'Badges'},
      {url: `/${owner}/${name}/settings/`, text: 'Settings'}
    ];

    return (
      <div>
        <Breadcrumb elements={[`${owner} / ${name}`]}/>
        <Tabs>
          {tabs.map((tab, index) => {
            return (
              <Tab key={index}>
                <Link to={tab.url} className={tab.url == this.props.pathname ? 'active' : ''}>{tab.text}</Link>
              </Tab>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    pathname: ownProps.location.pathname
  })
)(Header);

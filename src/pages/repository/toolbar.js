import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Tabs, Tab }from '../../components/layout/tabs';

class Toolbar extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    const tabs = [
      {url: `/${owner}/${name}`, text: 'Builds'},
      {url: `/${owner}/${name}/settings/badges`, text: 'Badges'},
      {url: `/${owner}/${name}/settings/`, text: 'Settings'}
    ];

    return (
      <Tabs>
        {tabs.map((tab, index) => {
          return (
            <Tab key={index}>
              <Link to={tab.url} className={tab.url == this.props.pathname ? 'active' : ''}>{tab.text}</Link>
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    pathname: ownProps.location.pathname
  })
)(Toolbar);

import React from 'react';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';

import { Tabs, Tab }from '../../components/layout/tabs';

class Toolbar extends React.Component {
  render() {
    const {owner, name, number} = this.props.params;

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
              <Link to={tab.url} className={tab.url == this.props.location.pathname ? 'active' : ''}>{tab.text}</Link>
            </Tab>
          );
        })}
      </Tabs>
    );
  }
}


export default branch({
  location: ['location']
}, Toolbar);

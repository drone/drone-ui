import React from 'react';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';

import { Tabs, Tab }from '../../components/layout/tabs';

class Toolbar extends React.Component {
  render() {
    const {user} = this.props;
    const {owner, name, number} = this.props.params;

    const tabs = [
      {url: `/${owner}/${name}`, text: 'Builds'},
      {url: `/${owner}/${name}/settings/badges`, text: 'Badges'}
    ];

    if (user) {
      tabs.push({url: `/${owner}/${name}/settings/`, text: 'Settings'});
    }

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
  user: ['user'],
  location: ['location']
}, Toolbar);

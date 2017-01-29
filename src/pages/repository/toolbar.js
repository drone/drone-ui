import {branch} from 'baobab-react/higher-order';
import {Link} from 'react-router';
import React from 'react';
import {Tabs, Tab}from '../../components/layout/tabs';

class Toolbar extends React.Component {
  render() {
    const {user} = this.props;
    const {owner, name} = this.props.params;

    const tabs = [
      {url: `/${owner}/${name}`, text: 'Builds'},
      {url: `/${owner}/${name}/settings/badges`, text: 'Badges'}
    ];

    if (user) {
      tabs.push({url: `/${owner}/${name}/settings/`, text: 'Settings'});
      tabs.push({url: `/${owner}/${name}/settings/secret/`, text: 'Secrets'});
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
  user: ['user']
}, Toolbar);

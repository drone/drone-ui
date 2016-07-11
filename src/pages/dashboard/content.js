import {branch} from 'baobab-react/higher-order';
import PageContent from '../../components/layout/content';
import React from 'react';

import './index.less';

class Content extends React.Component {

  render() {
    let {user} = this.props;

    if (!user || !user.login) {
      return (
        <PageContent fluid className="dashboard">
          <div className="alert">Welcome to Drone. Please <a href="/login">login</a> to proceed.</div>
        </PageContent>
      );
    }

    return (
      <PageContent fluid className="dashboard">
        <div className="alert">Welcome to Drone.</div>
      </PageContent>
    );
  }
}

export default branch({
  user: ['user']
}, Content);

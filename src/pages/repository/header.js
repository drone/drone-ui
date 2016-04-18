import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb from '../../components/layout/breadcrumb';
import { Tabs, Tab }from '../../components/layout/tabs';

class Header extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    return (
      <div>
        <Breadcrumb elements={[`${owner} / ${name}`]}/>
        <Tabs>
          <Tab>
            <Link to="/" className="active">Builds</Link>
          </Tab>
          <Tab>
            <Link to="/">Badges</Link>
          </Tab>
          <Tab>
            <Link to="/">Secrets</Link>
          </Tab>
          <Tab>
            <Link to="/">Settings</Link>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default connect()(Header);

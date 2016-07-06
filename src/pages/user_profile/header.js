import React from 'react';
import {Link} from 'react-router';
import {branch} from 'baobab-react/higher-order';

import Breadcrumb, {SEPARATOR} from '../../components/layout/breadcrumb';

class Header extends React.Component {
  render() {
    const {account} = this.props.params;
    if (!account) {
      return <Breadcrumb elements={['Account']}/>
    }

    return (
      <Breadcrumb elements={[
        <Link to={`/account`}>Account</Link>,
        SEPARATOR,
        <Link to={`/account/${account}`}>{account}</Link>
      ]}/>
    );
  }
}

export default branch({}, Header);

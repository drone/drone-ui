import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb, {SEPARATOR} from '../../components/layout/breadcrumb';

class Header extends React.Component {
  render() {
    const {account} = this.props.params;
    if (!account) {
      return <Breadcrumb elements={['Account']}/>;
    }

    return (
      <Breadcrumb elements={[
        <Link to={'/account'}>Account</Link>,
        SEPARATOR,
        <Link to={`/account/${account}`}>{account}</Link>
      ]}/>
    );
  }
}

export default connect()(Header);

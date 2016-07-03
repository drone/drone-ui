import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Breadcrumb, {SEPARATOR} from '../../components/layout/breadcrumb';

class Header extends React.Component {
  render() {
    const {owner, name, number} = this.props.params;

    return (
      <Breadcrumb elements={[
        <Link to={`/${owner}/${name}`}>{owner} / {name}</Link>,
        SEPARATOR,
        <Link to={`/${owner}/${name}/${number}`}>{number}</Link>
      ]}/>
    );
  }
}

export default connect()(Header);

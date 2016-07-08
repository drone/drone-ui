import React from 'react';
import { connect } from 'react-redux';

import Breadcrumb from '../../components/layout/breadcrumb';

class Header extends React.Component {
  render() {
    const {owner, name} = this.props.params;

    return (
      <div>
        <Breadcrumb elements={[`${owner} / ${name}`]}/>
      </div>
    );
  }
}

export default connect()(Header);

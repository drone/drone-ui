import React from 'react';

import './subnav.less';

export default
class Subnav extends React.Component {
  render() {
    return (
      <nav className="sub">
        {this.props.children}
      </nav>
    );
  }
}

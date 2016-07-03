import React from 'react';

import './tabs.less';

class Tabs extends React.Component {
  render() {
    return (
      <ul className="tabs">
        {this.props.children}
      </ul>
    );
  }
}

class Tab extends React.Component {
  render() {
    return (
      <li className="tab">
        {this.props.children}
      </li>
    );
  }
}

export {
  Tabs,
  Tab
};

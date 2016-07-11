import {branch} from 'baobab-react/higher-order';
import React from 'react';

class Header extends React.Component {
  componentDidMount() {
    document.title = 'welcome | drone';
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default branch({}, Header);

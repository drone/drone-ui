import React from 'react';
import {branch} from 'baobab-react/higher-order';

class Header extends React.Component {

  componentDidMount() {
    document.title = "welcome | drone";
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default branch({}, Header);

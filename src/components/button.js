import React from 'react';

import './button.less';

export default
class Button extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <button className="button" onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }

  handleClick(event) {
    this.props.onClick(event);
  }
}

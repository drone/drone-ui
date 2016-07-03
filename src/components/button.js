import React from 'react';

import './button.less';

export default
class Button extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    let classes = ['button'];

    if (this.props.danger) {
      classes.push('button--danger');
    }

    return (
      <button className={classes.join(' ')} onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }

  handleClick(event) {
    this.props.onClick(event);
  }
}

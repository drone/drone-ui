import React from 'react';

export default
class Dropdown extends React.Component {
  render() {
    let styles = {
      display: 'inline-block'
    };

    styles = Object.assign({}, styles, this.props.style);

    return (
      <div style={styles}>
        <i className="material-icons">expand_more</i>
      </div>
    );
  }
}

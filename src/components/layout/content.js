import React from 'react';

export default
class Content extends React.Component {
  render() {
    let classes = ['content'];

    if (this.props.fluid) {
      classes.push('content--fluid');
    }

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <main className={classes.join(' ')}>
        {this.props.children}
      </main>
    );
  }
}

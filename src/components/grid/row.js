import React from 'react';

export default
class Row extends React.Component {
  render() {
    const viewports = ['xs', 'sm', 'md', 'lg'];
    const alignments = ['start', 'center', 'end', 'top', 'middle', 'bottom', 'around', 'between'];

    let classes = ['row'];

    if (this.props.reverse) {
      classes.push('reverse');
    }

    viewports.forEach((viewport) => {
      alignments.forEach((alignment) => {
        if (this.props[`${alignment}-${viewport}`]) {
          classes.push(`${alignment}-${viewport}`);
        }
      });
    });

    return (
      <div className={classes.join(' ')}>
        {this.props.children}
      </div>
    );
  }
}

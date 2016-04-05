import React from 'react';

export default
class Col extends React.Component {
  render() {
    const viewports = ['xs', 'sm', 'md', 'lg'];

    let classes = [];
    viewports.forEach((viewport) => {
      // Set e.g. col-xs-12, col-lg-2
      let breakpoint = this.props[viewport];
      if (breakpoint) {
        classes.push(`col-${viewport}-${breakpoint}`)
      }

      // Set e.g. xs-offset-6, md-offset-10
      let offset = this.props[`${viewport}-offset`];
      if (offset) {
        classes.push(`col-${viewport}-offset-${offset}`)
      }

      // Set e.g. first-xs, first-md
      let first = this.props[`first-${viewport}`];
      if (first) {
        classes.push(`first-${viewport}`)
      }

      // Set e.g. last-xs, last-md
      let last = this.props[`last-${viewport}`];
      if (last) {
        classes.push(`last-${viewport}`)
      }
    });

    return (
      <div className={classes.join(' ')}>
        {this.props.children}
      </div>
    )
  }
}

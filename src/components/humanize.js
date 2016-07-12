import humanizeDuration from 'humanize-duration';
import React from 'react';

export default
class Humanize extends React.Component {
  render() {
    const {start, finished} = this.props;

    return (
      <span>{humanizeDuration((finished-start)*1000)}</span>
    );
  }
}

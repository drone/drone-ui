import React from 'react';

import './avatar.less';

export default
class Avatar extends React.Component {
  render() {
    const {src, circle} = this.props;

    let classes = [this.props.className, 'avatar'];

    if (circle) {
      classes.push('avatar--circle');
    }

    return (
      <img className={classes.join(' ').trim()} src={src}/>
    );
  }
}

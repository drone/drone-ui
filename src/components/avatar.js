import React from 'react';

export default
class Avatar extends React.Component {
  render() {
    const {src, circle} = this.props;

    let classes = ['avatar'];

    if (circle) {
      classes.push('avatar--circle');
    }

    return (
      <img className={classes.join(' ')} src={src}/>
    );
  }
}

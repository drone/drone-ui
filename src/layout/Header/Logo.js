import React from 'react';

export default
class Logo extends React.Component {
  render() {
    let styles = {
      width: 32,
      height: 32
    };
    return (
      <img src="/static/images/drone.svg" alt="drone logo" style={styles}/>
    );
  }
}

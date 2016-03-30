import React from 'react';

export default
class Avatar extends React.Component {
  render() {
    let styles = {
      width: 32,
      height: 32,
      borderRadius: '50%'
    };

    styles = Object.assign({}, styles, this.props.style);

    return (
      <img src="https://secure.gravatar.com/avatar/915d80f0d9b6678fad4d1ab36dfc8960" style={styles}/>
    );
  }
}

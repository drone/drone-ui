import React from 'react';

export default
class Avatar extends React.Component {
  render() {
    const {src} = this.props;
    return (
      <img className="avatar" src={src}/>
    );
  }
}

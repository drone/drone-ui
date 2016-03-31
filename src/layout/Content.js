import React from 'react';

export default
class Content extends React.Component {
  render() {
    return (
      <main className="content">
        {this.props.children}
      </main>
    );
  }
}

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div>Drone!</div>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));

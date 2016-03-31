import React from 'react';
import ReactDOM from 'react-dom';

import './index.less'

import Page from './layout/page';

class App extends React.Component {
  render() {
    return (
      <Page/>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));

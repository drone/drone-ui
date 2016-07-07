import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';

import {root} from 'baobab-react/higher-order';

import './index.less';

import { routes } from './routes';
import { tree } from './actions/tree'

// Creating our top-level component
class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        {routes}
      </Router>
    );
  }
}

// binds the application to our data tree.
const RootedApp = root(tree, App);

ReactDOM.render(<RootedApp />, document.querySelector('#app'));

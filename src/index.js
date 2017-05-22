/*eslint-disable */
import './index.less';

import {events} from './actions/events';
import React from 'react';
import ReactDOM from 'react-dom';
import {root} from 'baobab-react/higher-order';
import {routes} from './routes';
import superagent from 'superagent';
import {tree} from './actions/tree';
import {Router, browserHistory} from 'react-router';
import { AppContainer } from 'react-hot-loader';
/*eslint-enable */

const App = () => {
  return (
    <Router history={browserHistory}>
      {routes}
    </Router>
  );
};

// binds the application to our data tree.
const RootedApp = root(tree, App);

const render = () => {
  ReactDOM.render(<AppContainer><RootedApp /></AppContainer>, document.querySelector('#app'));
};

// attach the tree to the window for interactive testing.
window.tree=tree;
window.events=events;

// this is 'hardcoded' with webpack define plugin and the unused
// branch will be erased by dead code elimination
if (process.env.NODE_ENV === 'production') {
  render();
} else {
  superagent.get('/api/user').then((res) => {
    const user = JSON.parse(res.text);
    tree.set(['user'], user);
    render();
  });
}

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./routes', () => {
    render();
  });
}

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
/*eslint-enable */

import 'material-design-lite';

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

// attach the tree to the window for interactive testing.
window.tree=tree;
window.events=events;

// this is 'hardcoded' with webpack define plugin and the unused
// branch will be erased by dead code elimination
if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(<RootedApp />, document.querySelector('#app'));
} else {
  superagent.get('/api/user').then((res) => {
    const user = JSON.parse(res.text);
    tree.set(['user'], user);

    ReactDOM.render(<RootedApp />, document.querySelector('#app'));
  });
}

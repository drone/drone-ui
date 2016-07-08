import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import superagent from 'superagent';
import {root} from 'baobab-react/higher-order';

import './index.less';

import {routes} from './routes';
import {tree} from './actions/tree';
import {events} from './actions/events';

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
    window.STATE_FROM_SERVER = {user};

    ReactDOM.render(<RootedApp />, document.querySelector('#app'));
  });
}

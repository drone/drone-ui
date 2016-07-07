import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import {root} from 'baobab-react/higher-order';

import './index.less';

import { drone } from './data/reducers';
import { routes } from './routes';
import { tree } from './actions/tree'

function configureStore(initialState) {
  const logger = createLogger();

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    logger
  )(createStore);

  let combinedReducers = combineReducers({
    drone,
    routing: routerReducer
  });

  return createStoreWithMiddleware(combinedReducers, initialState);
}

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Creating our top-level component
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    );
  }
}

window.tree = tree;
// binds the application to our data tree.
const RootedApp = root(tree, App);

ReactDOM.render(<RootedApp />, document.querySelector('#app'));

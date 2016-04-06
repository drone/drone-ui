import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, IndexRoute, browserHistory, Route } from 'react-router';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import './index.less'

import { drone } from './data/reducers'

import Page from './components/layout/page';
import Dashboard from './pages/dashboard/index';

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

  return createStoreWithMiddleware(combinedReducers, initialState)
}

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

let app = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Page}>
        <IndexRoute components={{pageHead: Dashboard.Header, pageContent: Dashboard.Content}}/>
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(app, document.querySelector('#app'));

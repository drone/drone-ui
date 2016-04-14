import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, IndexRoute, browserHistory, Route } from 'react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import './index.less';

import { drone } from './data/reducers';

import Page from './components/layout/page';
import Pages from './pages/index';

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

let app = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Page}>
        <IndexRoute components={{pageHead: Pages.Dashboard.Header, pageContent: Pages.Dashboard.Content}}/>
        <Route path="/:owner/:name"
               components={{pageHead: Pages.Repository.Header, pageContent: Pages.Repository.Content}}/>
        <Route path="/:owner/:name/:number"
               components={{pageHead: Pages.Build.Header, pageContent: Pages.Build.Content}}/>
      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(app, document.querySelector('#app'));

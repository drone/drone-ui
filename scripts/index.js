import 'babel-polyfill'
import thunk from 'redux-thunk'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import { drone } from './reducers'
import { routes } from './router'
import Root from './containers/Root'


// Compose reduxReactRouter with other store enhancers
const store = compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)(drone, window.STATE_FROM_SERVER);

render(
  <Root store={store} />,
  document.getElementById('root')
);

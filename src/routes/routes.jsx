import React from 'react';
import { Route } from 'react-router-dom';

import Account from 'pages/account';
import Branches from 'pages/branches';
import Build from 'pages/build';
import Builds from 'pages/builds';
import Deployments from 'pages/deployments';
import Home from 'pages/home';
import Login from 'pages/login';
import NotFound from 'pages/not-found';
import Register from 'pages/register';
import Repo from 'pages/repo';
import Settings from 'pages/settings';
import SettingsAdmin from 'pages/settings-admin';
import Users from 'pages/users';
import Welcome from 'pages/welcome';

import RouteGuard from './route-guard';

export const Routes = {
  Home: (props) => <RouteGuard component={Home} {...props} />,
  LoginForm: (props) => <RouteGuard component={Login} {...props} />,
  Login: () => <p>Redirecting to Github Auth...</p>,
  Logout: (props) => <RouteGuard component={Welcome} {...props} />,
  LoginError: (props) => <RouteGuard component={Welcome} {...props} />,
  Register: (props) => <RouteGuard component={Register} {...props} />,
  Account: (props) => <RouteGuard component={Account} {...props} />,
  // @TODO: add a proper admin settings page
  Admin: (props) => <RouteGuard component={() => <h1>Admin Settings</h1>} {...props} />,
  Branches: (props) => <RouteGuard component={Branches} {...props} />,
  Deployments: (props) => <RouteGuard component={Deployments} {...props} />,
  Settings: (props) => <RouteGuard component={Settings} {...props} />,
  SettingsAdmin: (props) => <RouteGuard component={SettingsAdmin} {...props} />,
  Builds: (props) => <RouteGuard component={Builds} {...props} />,
  Build: (props) => <RouteGuard component={Build} {...props} />,
  // @TODO: add a proper 404 component
  NotFound: (props) => <RouteGuard component={NotFound} {...props} />,
  Welcome: (props) => <Route component={Welcome} {...props} />,
  Users: (props) => <RouteGuard component={Users} {...props} />,
  Repo: (props) => <RouteGuard component={Repo} {...props} />,
};

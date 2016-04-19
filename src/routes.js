import React from 'react';
import { IndexRoute, Route } from 'react-router';

import Page from './components/layout/page';
import Pages from './pages/index';

export const routes = (
  <Route path="/" component={Page}>
    <IndexRoute components={{pageHead: Pages.Dashboard.Header, pageContent: Pages.Dashboard.Content}}/>
    <Route path="/account/profile"
           components={{pageHead: Pages.UserProfile.Header, pageContent: Pages.UserProfile.Content}}/>
    <Route path="/:owner/:name"
           components={{pageHead: Pages.Repository.Header, pageContent: Pages.Repository.Content}}/>
    <Route path="/:owner/:name/settings"
           components={{pageHead: Pages.RepositorySettings.Header, pageContent: Pages.RepositorySettings.Content}}/>
    <Route path="/:owner/:name/settings/badges"
           components={{pageHead: Pages.RepositoryBadge.Header, pageContent: Pages.RepositoryBadge.Content}}/>
    <Route path="/:owner/:name/:number"
           components={{pageHead: Pages.Build.Header, pageContent: Pages.Build.Content}}/>
  </Route>
);

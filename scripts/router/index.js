import React from 'react'
import { Route, IndexRoute } from "react-router";
import App from "../containers/App";

import feed from "../containers/user/feed";
import repos from "../containers/user/repos";
import profile from "../containers/user/profile";
import nodes from "../containers/nodes";
import builds from "../containers/repo/builds";
import badge from "../containers/repo/badge";
import crypto from "../containers/repo/crypto";
import config from "../containers/repo/config";
import build from "../containers/repo/build";
import users from "../containers/users";
import useradd from "../containers/users/add";
import nodeadd from "../containers/nodes/add";

export const routes = (
  <Route path="/" component={App}>
    <IndexRoute components={{content: feed.Feed, pagehead: feed.Header}} />
    <Route path="/account/repos" components={{content: repos.Repos, pagehead: repos.Header}} />
    <Route path="/account/profile" components={{content: profile.Page, pagehead: profile.Header}} />
    <Route path="/system/nodes" components={{content: nodes.Page, pagehead: nodes.Header}} />
    <Route path="/system/nodes/add" components={{content: nodeadd.Page, pagehead: nodeadd.Header}} />
    <Route path="/system/users" components={{content: users.Page, pagehead: users.Header}} />
    <Route path="/system/users/add" components={{content: useradd.Page, pagehead: useradd.Header}} />
    <Route path="/:owner/:name" components={{content: builds.Builds, pagehead: builds.Header}} />
    <Route path="/:owner/:name/settings/badges" components={{content: badge.Page, pagehead: badge.Header}} />
    <Route path="/:owner/:name/settings/encrypt" components={{content: crypto.Page, pagehead: crypto.Header}} />
    <Route path="/:owner/:name/settings" components={{content: config.Page, pagehead: config.Header}} />
    <Route path="/:owner/:name/:number/:job" components={{content: build.Page, pagehead: build.Header}} />
    <Route path="/:owner/:name/:number" components={{content: build.Page, pagehead: build.Header}} />

  </Route>
);

//    <Route path="/:owner/:name" components={{content: Repo, pagehead: PageHead}} />
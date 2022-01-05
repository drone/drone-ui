import React, { useEffect, useContext } from 'react';
import {
  Route, Switch, Redirect, useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

import { VISIBILITY_LEVELS } from '_constants';
import Sidebar from 'components/shared/sidebar';
import { AppContextProvider, AppContext } from 'context';
import { useStreamBuildEvents, useViewer } from 'hooks/swr';
import { Layouts } from 'layouts';
import License from 'pages/license';
import { axiosWrapper } from 'utils';
import 'react-toastify/dist/ReactToastify.min.css';

import { Routes } from './routes/routes';

const swrConfig = {
  fetcher: async (url) => axiosWrapper(url, { method: 'GET' }),
  shouldRetryOnError: false,
  revalidateOnFocus: false,
};

const GlobalRequestWrapper = ({ render }) => {
  const { data, isLoading } = useViewer();
  const [context, setContext] = useContext(AppContext);

  useEffect(() => {
    // set the flag just once
    if (data && context.isAccSyncing === null) {
      setContext({
        ...context,
        isAccSyncing: data.syncing,
      });
    }
  }, [data, context, setContext]);

  useStreamBuildEvents();
  return isLoading ? null : render({ user: data });
};

export default function App() {
  const { pathname } = useLocation();
  return (
    <React.StrictMode>
      <SWRConfig value={swrConfig}>
        <AppContextProvider>
          <GlobalRequestWrapper render={({ user }) => (
            <>
              <Layouts.Base>
                <Switch>
                  <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
                  <Route path={['/welcome', '/login/form', '/login/error', '/logout', '/register']} exact />
                  <Route path={['/settings*']} exact>
                    <Sidebar user={user} />
                  </Route>
                  <Route path={'/*'}>
                    <Sidebar user={user} />
                    <License />
                  </Route>
                </Switch>

                <Switch>
                  <Routes.Home
                    path="/"
                    componentProps={{
                      user,
                    }}
                    visibility={VISIBILITY_LEVELS.PRIVATE}
                    exact
                  />
                  <Routes.Welcome
                    path="/welcome"
                    componentProps={{
                      user,
                    }}
                    exact
                  />
                  <Routes.Register
                    path="/register"
                    componentProps={{
                      user,
                    }}
                    exact
                  />
                  <Routes.LoginForm
                    path="/login/form"
                    exact
                  />
                  <Routes.LoginError
                    path="/login/error"
                    exact
                  />
                  <Routes.Logout
                    path="/logout"
                    exact
                  />
                  <Routes.Account
                    path="/account"
                    componentProps={{
                      user,
                    }}
                    visibility={VISIBILITY_LEVELS.PRIVATE}
                    exact
                  />
                  {/* contains nested routes */}
                  <Routes.SettingsAdmin
                    path="/settings*"
                    componentProps={{
                      user,
                    }}
                    visibility={VISIBILITY_LEVELS.ADMIN}
                    exact
                  />
                  {/* contains nested routes */}
                  <Routes.Repo
                    path={[
                      '/:namespace/:name',
                      '/:namespace/:name/deployments',
                      '/:namespace/:name/branches',
                      '/:namespace/:name/settings*',
                      '/:namespace/:name/:build',
                      '/:namespace/:name/:build/:stage?/:step?']}
                    componentProps={{
                      user,
                    }}
                    visibility={VISIBILITY_LEVELS.PUBLIC}
                    exact
                  />
                  <Routes.NotFound
                    path="*"
                    componentProps={{
                      user,
                    }}
                  />
                </Switch>
              </Layouts.Base>
              <ToastContainer
                position="top-center"
                limit={3}
                pauseOnHover
                hideProgressBar
              />
            </>
          )}
          />
        </AppContextProvider>
      </SWRConfig>
    </React.StrictMode>
  );
}

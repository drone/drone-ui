import React, { useEffect, useContext } from 'react';
import {
  Route, BrowserRouter, Switch,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';

import { VISIBILITY_LEVELS } from '_constants';
import Sidebar from 'components/shared/sidebar';
import { AppContextProvider, AppContext } from 'context';
import { useRecentBuilds, useStreamBuildEvents, useViewer } from 'hooks/swr';
import { Layouts } from 'layouts';
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
  useRecentBuilds();
  return isLoading ? null : render({ user: data });
};

export default function App() {
  return (
    <React.StrictMode>
      <SWRConfig value={swrConfig}>
        <BrowserRouter>
          <AppContextProvider>
            <GlobalRequestWrapper render={({ user }) => (
              <>
                <Layouts.Base>
                  <Switch>
                    <Route path={['/welcome', '/login/form', '/login/error', '/logout']} exact />
                    <Route path={['/settings*']} exact>
                      <Sidebar user={user} />
                    </Route>
                    <Route path={'/*'}>
                      <Sidebar user={user} />
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
        </BrowserRouter>
      </SWRConfig>
    </React.StrictMode>
  );
}

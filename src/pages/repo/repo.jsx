import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useCallback, useMemo, useContext,
} from 'react';
import {
  Route, Switch, NavLink, useRouteMatch,
} from 'react-router-dom';

import { VISIBILITY_LEVELS } from '_constants';
import NewBuildForm from 'components/pages/repo/new-build-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSpacer } from 'components/shared/breadcrumb';
import Button from 'components/shared/button';
import Modal, { useModal } from 'components/shared/modal';
import { AppContext } from 'context';
import { useToast } from 'hooks';
import { useRepo, updateBuilds } from 'hooks/swr';
import NotFound from 'pages/not-found';
import { Routes } from 'routes/routes';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { axiosWrapper } from 'utils';

import css from './repo.module.scss';

const cx = classNames.bind(css);

const getTabProps = ({
  isRepoNavDisabled, namespace, name, displaySettings,
}) => {
  const tabs = [
    {
      to: `/${namespace}/${name}`,
      exact: true,
      label: 'Builds',
      tag: isRepoNavDisabled ? 'span' : NavLink,
    },
    {
      to: `/${namespace}/${name}/branches`,
      exact: true,
      label: 'Branches',
      tag: isRepoNavDisabled ? 'span' : NavLink,
    },
    {
      to: `/${namespace}/${name}/deployments`,
      exact: true,
      label: 'Deployments',
      tag: isRepoNavDisabled ? 'span' : NavLink,
    },
    {
      to: `/${namespace}/${name}/settings`,
      label: 'Settings',
      tag: NavLink,
    },
  ];
  return displaySettings ? tabs : tabs.slice(0, tabs.length - 1);
};

const Repo = ({ user }) => {
  const { params } = useRouteMatch();
  const {
    namespace, name,
  } = params;
  const [context] = useContext(AppContext);
  const { isRepoNavDisabled } = context;
  const [isModalShowing, toggleModal] = useModal();

  const { data: repo, isLoading: isRepoDataLoading, isError } = useRepo({ namespace, name });

  const userIsAdminOrHasWritePerm = useMemo(() => (repo?.permissions?.write ?? false) || user?.admin, [repo, user]);

  const { showError, showSuccess } = useToast();

  const navEl = useMemo(() => (
    <nav className={cx('tabs')}>
      {getTabProps({
        isRepoNavDisabled, namespace, name, displaySettings: userIsAdminOrHasWritePerm,
      }).map((tab) => {
        if (tab.tag === 'span') {
          return <span className={cx('tab', 'tab-disabled')} key={tab.label}>{tab.label}</span>;
        }
        return (
          <NavLink
            className={cx('tab')}
            activeClassName={cx('tab-active')}
            exact={tab.exact}
            to={tab.to}
            key={tab.to}
          >
            {tab.label}
          </NavLink>
        );
      })}
    </nav>
  ), [isRepoNavDisabled, namespace, name, userIsAdminOrHasWritePerm]);

  const handleNewBuildClick = toggleModal;

  const handleNewBuildSubmit = useCallback(async (values) => {
    const queryParams = new URLSearchParams();
    if (values.target) {
      queryParams.set('branch', values.target);
    }
    if (values.commit) {
      queryParams.set('commit', values.commit);
    }
    if (values.parameters?.length) {
      values.parameters.forEach((param) => { queryParams.set(param.key, param.value); });
    }
    const queryString = queryParams.toString();
    const endpoint = `/api/repos/${namespace}/${name}/builds${queryString.length ? `?${queryString}` : ''}`;
    try {
      const newBuild = await axiosWrapper(endpoint, {
        method: 'POST',
      });
      showSuccess('New build has started successfully');
      updateBuilds(window.location.pathname, repo, newBuild);
    } catch (e) {
      showError(`Unable to start a new build: ${e.message}`);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [name, namespace, showError, showSuccess, repo]);
  if (isRepoDataLoading) {
    return null;
  }
  if (isError?.message === 'Not Found' || isError?.message === 'Unauthorized') {
    return <NotFound user={user} />;
  }
  return (
    <Switch>
      <Route
        path={[
          '/:namespace/:name',
          '/:namespace/:name/deployments',
          '/:namespace/:name/branches',
          '/:namespace/:name/settings*',
        ]}
        exact
      >
        <>
          <header className={cx('header')}>
            <div className={cx('inner')}>
              <Breadcrumb className={cx('breadcrumb')}>
                <BreadcrumbItem href="/" text="Repositories" />
                <BreadcrumbSpacer />
              </Breadcrumb>
              <h1>{name}</h1>
            </div>
            {!isRepoNavDisabled && userIsAdminOrHasWritePerm && (
              <Button
                theme="primary"
                className={cx('new-build-btn')}
                icon={<DemoIcon />}
                onClick={handleNewBuildClick}
              >
                New Build
              </Button>
            )}
          </header>
          {navEl}
          <Switch>

            <Routes.Branches
              path="/:namespace/:name/branches"
              componentProps={{
                user,
                repo,
              }}
              visibility={VISIBILITY_LEVELS.PUBLIC}
              exact
            />
            <Routes.Deployments
              path="/:namespace/:name/deployments"
              componentProps={{
                user,
                repo,
              }}
              visibility={VISIBILITY_LEVELS.PUBLIC}
              exact
            />
            {/* contains nested routes for crons and secrets */}
            <Routes.Settings
              path="/:namespace/:name/settings*"
              componentProps={{
                user,
                repo,
              }}
              visibility={VISIBILITY_LEVELS.PUBLIC}
            />
            <Routes.Builds
              path="/:namespace/:name"
              componentProps={{
                user,
                repo,
              }}
              visibility={VISIBILITY_LEVELS.PUBLIC}
              exact
            />
          </Switch>
          <Modal
            title="Create a New Build"
            isShowing={isModalShowing}
            hide={toggleModal}
          >
            <NewBuildForm handleSubmit={handleNewBuildSubmit} handleCancel={toggleModal} />
          </Modal>
        </>
      </Route>
      <Routes.Build
        path="/:namespace/:name/:build/:stage?/:step?"
        componentProps={{
          user,
          userIsAdminOrHasWritePerm,
        }}
        visibility={VISIBILITY_LEVELS.PUBLIC}
      />
    </Switch>
  );
};

Repo.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool,
  }).isRequired,
};

export default Repo;

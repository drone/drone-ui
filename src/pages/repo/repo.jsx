import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useCallback, useState, useMemo, useContext,
} from 'react';
import {
  Route, Switch, NavLink, useRouteMatch,
} from 'react-router-dom';

import { VISIBILITY_LEVELS } from '_constants';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSpacer } from 'components/shared/breadcrumb';
import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import Modal, { useModal } from 'components/shared/modal';
import { AppContext } from 'context';
import { useToast } from 'hooks';
import { useRepo } from 'hooks/swr';
import NotFound from 'pages/not-found';
import { Routes } from 'routes/routes';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { axiosWrapper } from 'utils';

import css from './repo.module.scss';

const cx = classNames.bind(css);

const NewBuildForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    target: '',
    commit: '',
    parameters: [],
  });
  const [parameterState, setParameterState] = useState({
    key: '',
    value: '',
  });
  const handleAddParameter = () => {
    if (parameterState.key && parameterState.value) {
      setState(
        (prev) => ({
          ...prev,
          parameters: [...prev.parameters, { ...parameterState, id: Date.now() }],
        }),
      );
      setParameterState({ key: '', value: '' });
    }
  };

  const handleRemoveParameter = (id) => () => setState(
    (prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }),
  );

  const handleParameterChange = (field) => (event) => {
    setParameterState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };
  const handleSubmitMiddleware = (event) => {
    event.preventDefault();
    handleSubmit(state);
    handleCancel();
  };

  const handleFieldChange = (field) => (event) => {
    setState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };
  return (
    <Form className={cx('new-build-form')}>
      <FormSection className={cx('new-build-form-column')}>
        <Field.Input
          label="Branch"
          placeholder="master"
          value={state.target}
          name="branch"
          autoFocus="true"
          onChange={handleFieldChange('target')}
        />
      </FormSection>
      <FormSection title="Parameters" className={cx('new-build-form-column')}>
        {state.parameters.length ? (
          <div className={cx('new-build-form-parameters-list')}>
            {state.parameters.map(({ key, value, id }) => (
              <div className={cx('new-build-form-parameters')} key={id}>
                <Field.Input
                  value={key}
                  name={key}
                  readOnly
                />
                <Field.Input
                  name={value}
                  value={value}
                  readOnly
                />
                <Button theme="plain" type="button" onClick={handleRemoveParameter(id)}>Remove</Button>
              </div>
            ))}
          </div>
        ) : null}
        <div className={cx('new-build-form-parameters-fields')}>
          <Field.Input
            placeholder="key"
            value={parameterState.key}
            onChange={handleParameterChange('key')}
          />
          <Field.Input
            placeholder="value"
            value={parameterState.value}
            onChange={handleParameterChange('value')}
          />
          <Button theme="plain" type="button" onClick={handleAddParameter}>+ Add</Button>
        </div>
      </FormSection>
      <FormSection className={cx('new-build-form-controls')}>
        <Button theme="primary" type="submit" onClick={handleSubmitMiddleware}>Create</Button>
        <Button theme="primary" type="button" onClick={handleCancel}>Cancel</Button>
      </FormSection>
    </Form>
  );
};

NewBuildForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

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
    namespace, name, build, stage = 1, step = 1,
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
    let endpoint = `/api/repos/${namespace}/${name}/builds`;
    if (values.target) {
      endpoint = `${endpoint}?branch=${values.target}`;
      if (values.commit) {
        endpoint = `${endpoint}&commit=${values.commit}`;
      }
      if (values.parameters?.length) {
        endpoint = `${endpoint}&${values.parameters.map((param) => `${param.key}=${param.value}`).join('&')}`;
      }
    }
    try {
      await axiosWrapper(endpoint, {
        method: 'POST',
      });
      showSuccess('New build has started successfully');
    } catch (e) {
      showError(`Unable to start a new build: ${e.message}`);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [name, namespace, showError, showSuccess]);
  if (isRepoDataLoading) {
    return null;
  }
  if (isError?.message === 'Not Found' || isError?.message === 'Unauthorized') {
    return <NotFound />;
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
        key={`${namespace}/${name}/${build}/${stage}/${step}`}
        componentProps={{
          user,
          userIsAdminOrHasWritePerm,
        }}
        visibility={VISIBILITY_LEVELS.PUBLIC}
      />
    </Switch>
  );
};

export default Repo;

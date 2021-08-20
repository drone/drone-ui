import classNames from 'classnames/bind';
import React, {
  useMemo,
} from 'react';
import {
  Route, Redirect, Switch, NavLink,
} from 'react-router-dom';

import { VISIBILITY_LEVELS } from '_constants';
import { Routes } from 'routes/routes';

import css from './settings-admin.module.scss';

const cx = classNames.bind(css);

const getTabProps = () => [
  {
    to: '/settings/users',
    exact: true,
    label: 'Users',
  },
  // {
  //   to: '/settings/admin',
  //   exact: true,
  //   label: 'Admin',
  // },
];

const SettingsAdmin = ({ user }) => {
  const navEl = useMemo(() => (
    <nav className={cx('tabs')}>
      {getTabProps().map((tab) => (
        <NavLink
          className={cx('tab')}
          activeClassName={cx('tab-active')}
          exact={tab.exact}
          to={tab.to}
          key={tab.to}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  ), []);

  return (
    <>
      <header className={cx('header')}>
        <div className={cx('inner')}>
          <h1>System Administration</h1>
        </div>
      </header>
      {navEl}
      <Switch>
        <Route
          path="/settings"
          component={() => <Redirect from="/settings" to="/settings/users" strict exact />}
          exact
        />
        <Routes.Users
          path="/settings/users"
          componentProps={{
            user,
          }}
          visibility={VISIBILITY_LEVELS.ADMIN}
          exact
        />
        {/* <Routes.Admin
          path="/settings/admin"
                                componentProps={{
                        user,
                      }}
          exact
          isAdminOnly
        /> */}
      </Switch>
    </>
  );
};

export default SettingsAdmin;

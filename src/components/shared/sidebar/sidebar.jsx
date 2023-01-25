import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { THEMES } from '_constants';
import { useTheme } from 'hooks';
import logo from 'svg/logo.svg';
import { ReactComponent as SearchIcon } from 'svg/search.svg';
import { ReactComponent as SettingsIcon } from 'svg/settings.svg';
import { ReactComponent as DarkThemeIcon } from 'svg/theme-dark.svg';
import { ReactComponent as LightThemeIcon } from 'svg/theme-light.svg';
import { ReactComponent as UserIcon } from 'svg/user.svg';

import Avatar from '../avatar';
import Button from '../button';

import SearchDrawer from './search-drawer';
import styles from './sidebar.module.scss';

const cx = classNames.bind(styles);

const Anonymous = () => (
  <Link className={cx('sidebar-item', 'anonymous')} to="/welcome">
    <div role="img" aria-label="Click to sign in">
      <UserIcon />
    </div>
    <span>Click to sign in or sign up.</span>
  </Link>
);
export default function Sidebar(props) {
  const {
    user,
  } = props;
  const [isSearchDrawerShown, setIsSearchDrawerShown] = useState(false);
  const { storedTheme, toggleTheme } = useTheme();
  const isUserAuthenticated = !!user;
  const isUserAdmin = user?.admin;
  const hideSearchDrawer = () => setIsSearchDrawerShown(false);
  const showSearchDrawer = () => setIsSearchDrawerShown(true);

  const topPart = (
    <div className={cx('top')}>
      <Button
        as="link"
        to="/"
        className={cx('sidebar-item', 'logo')}
      >
        <img src={logo} alt="Drone Logo" />
      </Button>
      {isUserAuthenticated && (
      <Button
        className={cx('sidebar-item', 'search-btn')}
        theme="plain"
        label="Search"
        onClick={showSearchDrawer}
      >
        <SearchIcon />
      </Button>
      )}
    </div>
  );

  const bottomPart = (
    <div className={cx('bottom')}>
      <Button
        className={cx('sidebar-item', 'theme-btn')}
        label="Search"
        onClick={toggleTheme}
      >
        {storedTheme === THEMES.DARK ? (
          <LightThemeIcon />
        ) : (
          <DarkThemeIcon />
        )}
      </Button>
      {isUserAdmin ? (

        <NavLink
          to="/settings"
          className={cx('sidebar-item')}
          activeClassName={cx('sidebar-item-active')}
        >
          <SettingsIcon />
        </NavLink>
      ) : null}
      {isUserAuthenticated ? (
        <NavLink
          as="link"
          to="/account"
          className={cx('sidebar-item')}
          activeClassName={cx('sidebar-item-active')}
          theme="plain"
        >
          <Avatar className={cx('avatar')} path={user?.avatar} text={user?.login} />
        </NavLink>
      ) : (
        <Anonymous />
      )}
    </div>
  );

  return (
    <>
      <aside className={cx('wrapper')}>
        <nav className={cx('sidebar')}>
          {topPart}
          {bottomPart}
        </nav>
      </aside>
      {user ? (
        <SearchDrawer isShown={isSearchDrawerShown} hide={hideSearchDrawer} />
      ) : undefined}
    </>
  );
}

Sidebar.defaultProps = {
  user: null,
  drawer: null,
};

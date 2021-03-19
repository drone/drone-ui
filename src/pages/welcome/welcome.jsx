import classNames from 'classnames/bind';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { ReactComponent as ChevronDownIcon } from 'svg/chevron-down.svg';
import { ReactComponent as DroneLogo } from 'svg/logo-full.svg';
import { ReactComponent as WelcomePageIllustration } from 'svg/welcome-illustration.svg';

import css from './welcome.module.scss';

const cx = classNames.bind(css);

const parseQuery = (queryString) => {
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  return pairs.reduce((acc, pair) => {
    const [key, val] = pair.split('=');
    return {
      ...acc,
      [decodeURIComponent(key)]: decodeURIComponent(val || ''),
    };
  }, {});
};

export default function Welcome() {
  const { pathname, search } = useLocation();
  let error = null;
  switch (pathname) {
    case '/logout':
      error = <div className={cx('error')}>Your session has been successfully terminated.</div>;
      break;
    case '/login/error':
      error = <div className={cx('error')}>{parseQuery(search)?.message ?? 'An error occured during login attempt, please, try again'}</div>;
      break;
    default:
  }
  return (
    <section className={cx('wrapper')}>
      <div className={cx('login')}>
        <div className={cx('kicker')}>
          <DroneLogo />
        </div>
        <div className={cx('header')}>
          <h1 className={cx('title')}>
            Hello,
            <br />
            Welcome to Drone.
          </h1>
          {error}
          <p>You will be redirected to your source control management system to authenticate.</p>
        </div>
        <a href="/login" target="_self" className={cx('btn')}>
          <span>Continue</span>
          <ChevronDownIcon className={cx('chevron-right')} />
        </a>
      </div>
      <div className={cx('illustration')}>
        <WelcomePageIllustration />
      </div>
    </section>
  );
}

import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './breadcrumb.module.scss';

const cx = classNames.bind(styles);

export function Breadcrumb(props) {
  const { className } = props;
  return (
    <nav className={cx('breadcrumb', className || '')}>
      {props.children}
    </nav>
  );
}

export function BreadcrumbItem(props) {
  return (
    <div className={cx('breadcrumb-item')}>
      { props.href
        ? <Link to={props.href}>{props.text}</Link>
        : props.text}
    </div>
  );
}

export function BreadcrumbSpacer() {
  return (
    <div className={cx('breadcrumb-spacer')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as NotActive } from 'svg/not-active.svg';

import css from './zero-state.module.scss';

const cx = classNames.bind(css);

const mapPageToIcons = {
  builds: <NotActive />,
};

export default function ZeroState(props) {
  const {
    page, title, message, children,
  } = props;
  return (
    <section className={cx('wrapper')}>
      <div className={cx('inner')}>
        {mapPageToIcons[page]}
        <h2>{title}</h2>
        {message && (
          <p>{message}</p>
        )}
        <div>
          {children}
        </div>
      </div>
    </section>
  );
}

ZeroState.propTypes = {
  page: PropTypes.oneOf(['builds']),
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

ZeroState.defaultProps = {
  page: 'builds',
  title: 'It looks a little empty here!',
  children: null,
  message: null,
};

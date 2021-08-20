import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './base.module.scss';

const cx = classNames.bind(styles);

export default function Base(props) {
  const {
    children,
  } = props;
  return (
    <>
      <div className={cx('wrapper')}>
        {children[0]}
        <div className={cx('inner')}>
          <main className={cx('container', 'content')}>
            {children[1]}
          </main>
        </div>
      </div>
    </>
  );
}

Base.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

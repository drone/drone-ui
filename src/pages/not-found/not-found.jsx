import classNames from 'classnames/bind';
import React from 'react';

import { useCustomTitle } from 'hooks';
import { ReactComponent as NotFoundIcon } from 'svg/not-found.svg';

import css from './not-found.module.scss';

const cx = classNames.bind(css);

export default function NotFound() {
  useCustomTitle('Not Found');

  return (
    <section className={cx('wrapper')}>
      <div className={cx('inner')}>
        <NotFoundIcon />
        <p className={cx('note')}>
          <span>We are sorry, the resource you requested cannot be found.</span>
          <sub>That's all we know.</sub>
        </p>
      </div>
    </section>
  );
}

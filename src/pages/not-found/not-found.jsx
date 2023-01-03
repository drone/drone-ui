import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Button from 'components/shared/button';
import { useCustomTitle } from 'hooks';
import { ReactComponent as NotFoundIcon } from 'svg/not-found.svg';

import css from './not-found.module.scss';

const cx = classNames.bind(css);

export default function NotFound({ user }) {
  useCustomTitle('Not Found');

  return (
    <section className={cx('wrapper')}>
      <div className={cx('inner')}>
        <NotFoundIcon />
        <p className={cx('note')}>
          <span>We are sorry, the resource you requested cannot be found.</span>
          <sub>That&apos;s all we know.</sub>
        </p>
        {!user && (
          <Button
            as="link"
            to="/welcome"
            theme="primary"
            className={cx('btn')}
          >
            Sign In
          </Button>
        )}
      </div>
    </section>
  );
}

NotFound.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string,
  }),
};

NotFound.defaultProps = {
  user: undefined,
};

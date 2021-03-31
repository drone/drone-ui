import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Status from 'components/shared/status';
import { ReactComponent as Commit } from 'svg/scm/commit.svg';

import styles from './repos.module.scss';

const cx = classNames.bind(styles);

const Repos = (props) => {
  const { repos } = props;
  return (
    <div className={cx('list')}>
      <div className={cx('body')}>
        {!!repos?.length && repos.map(({
          namespace, name, id, build, active, slug,
        }) => (
          <Link
            to={`/${namespace}/${name}${active ? '' : '/settings'}`}
            key={id}
          >
            <div className={cx('item', build ? null : 'inactive')}>
              <h3 className={cx('title')}>
                <Status status={build?.status ?? 'inactive'} />
                <span>{slug}</span>
              </h3>
              <div className={cx('detail')}>
                <div className={cx('spacer')} />
                <div className={cx('commit')}>
                  <strong>
                    <Commit />
                    {build?.after.slice(0, 8)}
                  </strong>
                  <span>{(build?.title || build?.message)}</span>
                </div>
                {build && (
                <div className={cx('date')}>
                  {formatDistanceStrict(new Date(build.created * 1000), new Date(), { addSuffix: true })}
                </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

Repos.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    namespace: PropTypes.string,
    name: PropTypes.string,
    active: PropTypes.bool,
    build: PropTypes.shape({
      status: PropTypes.string,
      event: PropTypes.string,
      sender: PropTypes.string,
      author_avatar: PropTypes.string,
      deploy_to: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.string,
      after: PropTypes.string,
      ref: PropTypes.string,
      created: PropTypes.number,
    }),
  })),
};

Repos.defaultProps = {
  repos: [],
};

export default Repos;

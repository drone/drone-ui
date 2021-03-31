import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from 'components/shared/avatar';
import { Label } from 'components/shared/label';
import Status from 'components/shared/status';

import styles from './repos-recent.module.scss';

const cx = classNames.bind(styles);

const ReposRecent = (props) => {
  const { repos } = props;
  return (
    <div className={cx('cards')}>
      {!!repos?.length && props.repos.map(({
        namespace, name, build, id,
      }) => (
        <Link to={`/${namespace}/${name}`} key={id}>
          <div className={cx('card')}>
            <div className={cx('header')}>
              <h3 className={cx('title')}>
                <span className={cx('namespace')}>{namespace}</span>
                <span>{name}</span>
              </h3>
              <Status status={build?.status} className={cx('status')} />
            </div>
            <div className={cx('body')}>
              <Label
                event={build?.event}
                commit={build?.after}
                branch={build?.target}
                environment={build?.deploy_to}
                refs={build?.ref}
              />
              <span>{build?.title || build?.message}</span>
            </div>
            <div className={cx('footer')}>
              <div>
                <Avatar
                  className={cx('avatar')}
                  path={build?.author_avatar}
                  alt={build?.sender}
                  text={build?.sender}
                />
              </div>
              {build && (
              <div>{formatDistanceStrict(new Date(build.created * 1000), new Date(), { addSuffix: true })}</div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

ReposRecent.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    namespace: PropTypes.string,
    name: PropTypes.string,
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

ReposRecent.defaultProps = {
  repos: [],
};

export default ReposRecent;

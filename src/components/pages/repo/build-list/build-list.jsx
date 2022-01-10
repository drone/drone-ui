import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Activity from 'components/shared/activity/simple';
import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';

import styles from './build-list.module.scss';

const cx = classNames.bind(styles);

const BuildListItem = ({ build, url }) => (
  <li>
    <Link to={`${url}/${build.number}`}>
      <div className={cx('list-item')}>
        <div className={cx('status')}>
          <Status status={build.status} />
          <div className={cx('connector')} />
        </div>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('number')}>{build.number}</div>
            <div className={cx('commit')}>{build.title || build.message?.trim()}</div>
          </div>
          <div className={cx('content')}>
            <Activity
              className={cx('activity')}
              number={build.number}
              event={build.event}
              action={build.action}
              actor={build.sender}
              avatar={build.author_avatar}
              commit={build.after}
              branch={build.target}
              target={build.deploy_to}
              parent={build.parent}
              cron={build.cron}
              refs={build.ref}
              trigger={build.trigger}
            />
            <div className={cx('timing')}>
              <div>
                {formatDistanceStrict(new Date(build.created * 1000), new Date(), { addSuffix: true })}
              </div>
              <div className={cx('dot')}><span /></div>
              <div>
                <Elapsed
                  started={build.started}
                  finished={build.finished}
                  className={cx('elapsed')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  </li>
);

const BuildList = ({ data, url }) => (
  <ul className={cx('list')}>
    {data.map((build) => <BuildListItem key={build.number} build={build} url={url} />)}
  </ul>
);

const buildPropTypes = PropTypes.shape({
  id: PropTypes.number,
  number: PropTypes.number,
  status: PropTypes.string,
  title: PropTypes.number,
  message: PropTypes.string,
  event: PropTypes.string,
  action: PropTypes.string,
  sender: PropTypes.string,
  author_avatar: PropTypes.string,
  after: PropTypes.string,
  target: PropTypes.string,
  deploy_to: PropTypes.string,
  parent: PropTypes.number,
  cron: PropTypes.bool,
  ref: PropTypes.string,
  created: PropTypes.number,
  started: PropTypes.number,
  finished: PropTypes.number,
  trigger: PropTypes.string,
});

BuildListItem.propTypes = {
  build: buildPropTypes.isRequired,
  url: PropTypes.string.isRequired,
};

BuildList.propTypes = {
  data: PropTypes.arrayOf(buildPropTypes).isRequired,
  url: PropTypes.string.isRequired,
};

export default BuildList;

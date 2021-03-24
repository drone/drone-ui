import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Activity from 'components/shared/activity/simple';
import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';

import styles from './build-list.module.scss';

const cx = classNames.bind(styles);

const BuildList = (props) => {
  const { url, data } = props;
  return (
    <ul className={cx('list')}>
      {props.data.map((build) => (
        <li key={build.id}>
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
                    refs={build.ref}
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
      ))}
    </ul>
  );
};

export default BuildList;

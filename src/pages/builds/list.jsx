import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Activity from 'components/shared/activity/simple';
import Elapsed from 'components/shared/elapsed';
import Status from 'components/shared/status';

import styles from './list.module.scss';

const cx = classNames.bind(styles);

export function List(props) {
  return (
    <>
      <div className={cx('list')}>
        {props.data.map((build) => (
          <Link to={`${props.url}/${build.number}`} key={build.id}>
            <ListItem key={build.build_id} data={build} />
          </Link>
        ))}
      </div>
    </>
  );
}

export function ListItem({ data }) {
  return (
    <>
      <div className={cx('list-item')}>
        <div className={cx('status')}>
          <Status status={data.status} />
          <div className={cx('connector')} />
        </div>
        <div className={cx('container')}>
          <div className={cx('header')}>
            <div className={cx('number')}>{data.number}</div>
            <div className={cx('commit')}>{data.title || data.message?.trim()}</div>
          </div>
          <div className={cx('content')}>
            <Activity
              number={data.number}
              event={data.event}
              action={data.action}
              actor={data.sender}
              avatar={data.author_avatar}
              commit={data.after}
              branch={data.target}
              target={data.deploy_to}
              refs={data.ref}
            />
            <div className={cx('timing')}>
              <div>{formatDistanceStrict(new Date(data.created * 1000), new Date(), { addSuffix: true })}</div>
              <div className={cx('dot')}><span /></div>
              <div><Elapsed started={data.started} finished={data.finished} className={cx('elapsed')} /></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

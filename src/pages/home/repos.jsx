import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Status from 'components/shared/status';
import { ReactComponent as Commit } from 'svg/scm/commit.svg';

import styles from './repos.module.scss';

const cx = classNames.bind(styles);

export function RepoList(props) {
  return (
    <div className={cx('list')}>
      <div className={cx('body')}>
        {props.repos && props.repos.map((repo) => (
          <Link to={`/${repo.namespace}/${repo.name}${repo.active ? '' : '/settings'}`} key={repo.id}>
            <RepoListItem key={repo.id} build={repo.build} repo={repo} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RepoListItem({ repo, build }) {
  return (
    <>
      <div className={cx('item', build ? null : 'inactive')}>
        <div className={cx('title')}>
          <div>
            <Status status={build ? build.status : 'inactive'} />
          </div>
          <div>{repo.slug}</div>
        </div>
        <div className={cx('detail')}>
          <div />
          <div className={cx('commit')}>
            {/* {build && <Avatar path={build.author_avatar} alt={build.actor} />} */}
            <strong>
              <Commit />
              {build && build.after.slice(0, 8)}
            </strong>
            <span>{build && (build.title || build.message)}</span>
          </div>
          <div className={cx('date')}>
            {build && formatDistanceStrict(new Date(build.created * 1000), new Date(), { addSuffix: true })}
          </div>
        </div>
      </div>
    </>
  );
}

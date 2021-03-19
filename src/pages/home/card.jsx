import classNames from 'classnames/bind';
import { formatDistanceStrict } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from 'components/shared/avatar';
import Status from 'components/shared/status';
import { Label } from 'components/shared/label';

import styles from './card.module.scss';

const cx = classNames.bind(styles);

export function Cards(props) {
  return (
    <div className={cx('cards')}>
      {props.repos && props.repos.map((repo) => (
        <Link to={`/${repo.namespace}/${repo.name}`} key={repo.id}>
          <Card key={repo.id} build={repo.build} repo={repo} />
        </Link>
      ))}
    </div>
  );
}

export function Card({ repo, build }) {
  return (
    <>
      <div className={cx('card')}>
        <div className={cx('header')}>
          <h3>
            <span>{repo.namespace}</span>
            <span>{repo.name}</span>
          </h3>
          <div>
            <Status status={build.status} />
          </div>
        </div>
        <div className={cx('body')}>
          <Label
            event={build?.event}
            commit={build?.after}
            branch={build?.target}
            environment={build?.deploy_to}
            refs={build?.ref}
          />
          <span>{build.title || build.message}</span>
        </div>
        <div className={cx('footer')}>
          <div>
            <Avatar path={build.author_avatar} alt={build.sender} text={build.sender} />
          </div>
          <div>{build && formatDistanceStrict(new Date(build.created * 1000), new Date(), { addSuffix: true })}</div>
        </div>
      </div>
    </>
  );
}

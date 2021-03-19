import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useLayoutEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import Status from 'components/shared/status';
import ZeroState from 'components/shared/zero-state';
import { useBranches } from 'hooks/swr';

import styles from './branches.module.scss';

const cx = classNames.bind(styles);

export default function Branches({ repo }) {
  const { active: isRepoActive } = repo;
  const { namespace, name } = useParams();
  const { data, isLoading } = useBranches({ namespace, name });

  const history = useHistory();

  // if repo is inactive, redirect to settings where
  // user can proceed with repo activation
  useLayoutEffect(() => {
    if (!isRepoActive) {
      history.replace(`/${namespace}/${name}/settings`);
    }
  }, [isRepoActive, history, namespace, name]);

  let content = null;

  if (isLoading) {
    // TODO(bradrydzewski) set the content to a loading indicator
    // once we have the mockups from the design team.
    content = null;
  } else if (data.length) {
    content = (
      <section className={cx('wrapper')}>
        <div className={cx('inner')}>
          <BranchListView data={data} />
        </div>
      </section>
    );
  } else {
    content = (
      <ZeroState title="Your Branch List is Empty." message="This list will be populated when you execute a pipeline for an open branch." />
    );
  }
  return (
    <>
      {content}
    </>
  );
}

Branches.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      namespace: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

//
// TODO move to component
//

function BranchListView(props) {
  return (
    <>
      <div className={cx('branch-list-header')}>
        <div />
        <div>Branch</div>
        <div>Commit</div>
        <div>Committer</div>
        <div>Message</div>
      </div>
      <div className={cx('branch-list')}>
        {props.data.map((build) => (
          <Link to={`${build.number}`} key={build.id}>
            <BranchListItem data={build} />
          </Link>
        ))}
      </div>
    </>
  );
}

function BranchListItem({ data }) {
  return (
    <>
      <div className={cx('branch-list-item')}>
        <div>
          <Status status={data.status} />
        </div>
        <div>{data.target}</div>
        <div>{data.after.slice(0, 8)}</div>
        <div>
          <img src={data.author_avatar} />
          <span>{data.author_login}</span>
        </div>
        <div><span>{data.message}</span></div>
      </div>
    </>
  );
}

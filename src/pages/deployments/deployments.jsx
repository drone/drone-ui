import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useLayoutEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';

import Avatar from 'components/shared/avatar';
import Status from 'components/shared/status';
import ZeroState from 'components/shared/zero-state';
import { useDeployments } from 'hooks/swr';

import styles from './deployments.module.scss';

const cx = classNames.bind(styles);

export default function Deployments({ repo }) {
  const { active: isRepoActive } = repo;
  const { namespace, name } = useParams();

  const history = useHistory();

  // if repo is inactive, redirect to settings where
  // user can proceed with repo activation
  useLayoutEffect(() => {
    if (!isRepoActive) {
      history.replace(`/${namespace}/${name}/settings`);
    }
  }, [isRepoActive, history, namespace, name]);

  const { data, isLoading } = useDeployments({ namespace, name });

  let content = null;

  if (isLoading) {
    // TODO(bradrydzewski) set the content to a loading indicator
    // once we have the mockups from the design team.
    content = null;
  } else if (data.length) {
    content = (
      <section className={cx('wrapper')}>
        <div className={cx('inner')}>
          <DeploymentListView builds={data} />
        </div>
      </section>
    );
  } else {
    content = (
      <ZeroState
        title="Your Deployment List is Empty."
        message="This list will be populated when you promote or rollback a build."
      />
    );
  }

  return (
    <>
      {content}
    </>
  );
}

Deployments.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      namespace: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

//
// @TODO move to component
//

function DeploymentListView(props) {
  return (
    <>
      <div className={cx('deployment-list-header')}>
        <div />
        <div>Environment</div>
        <div>Commit</div>
        <div>Committer</div>
        <div>Message</div>
      </div>
      <div className={cx('deployment-list')}>
        {props.builds.map((build) => (
          <Link to={`${build.number}`} key={build.build_id}>
            <DeploymentListItem key={build.build_id} build={build} />
          </Link>
        ))}
      </div>
    </>
  );
}

function DeploymentListItem({ build }) {
  return (
    <>
      <div className={cx('deployment-list-item')}>
        <div>
          <Status status={build.status} />
        </div>
        <div className={cx('target')}>{build.deploy_to}</div>
        <div className={cx('commit')}>{build.after.slice(0, 8)}</div>
        <div>
          <Avatar
            className={cx('avatar')}
            path={build.author_avatar}
            alt={build.author_login}
            text={build.author_login}
          />
          <span>{build.author_login}</span>
        </div>
        <div className={cx('message')}><span>{build.message}</span></div>
      </div>
    </>
  );
}

import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

import { instance } from '_constants';
import Avatar from 'components/shared/avatar';
import { ReactComponent as BranchesIcon } from 'svg/branches.svg';
import { ReactComponent as GitNodeIcon } from 'svg/git-node.svg';

import styles from './activity.module.scss';

const cx = classNames.bind(styles);

const PushActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <Avatar className={cx('avatar')} path={props.avatar} alt={props.actor} text={props.actor} />
    <span>
      {props.actor}
      {' '}
      pushed
    </span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${instance}/link/${props.namespace}/${props.name}/commit/${props.commit}`}
    >
      <GitNodeIcon className={cx('icon-node')} />
      {props.commit && props.commit.substr(0, 8) }
    </a>
    <span>to</span>
    <strong>
      <BranchesIcon className={cx('icon-branches')} />
      {props.branch}
    </strong>
  </div>
);

const PullRequestActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <Avatar className={cx('avatar')} path={props.avatar} alt={props.actor} text={props.actor} />
    <span>
      {props.actor}
      {props.action === 'opened' ? ' opened ' : ' synchronized '}
      pull request
    </span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${instance}/link/${props.namespace}/${props.name}/tree/${props.refs}`}
    >
      #
      {props.refs && props.refs.split('/').reverse()[1]}
    </a>
    <span>to</span>
    <strong>
      <BranchesIcon className={cx('icon-branches')} />
      {props.branch}
    </strong>
  </div>
);

const TagActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <Avatar path={props.avatar} alt={props.actor} text={props.actor} />
    <span>
      {props.actor}
      {' '}
      created tag
    </span>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${instance}/link/${props.namespace}/${props.name}/tree/${props.refs}`}
    >
      {props.refs && props.refs.split('/').reverse()[0]}
    </a>
  </div>
);

const PromoteActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <Avatar path={props.avatar} alt={props.actor} text={props.actor} />
    <span>{props.sender}</span>
    <span>promoted</span>
    <span>{props.build}</span>
    <span>promoted</span>
    <span>{props.target}</span>
  </div>
);

const RollbackActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <Avatar path={props.avatar} alt={props.actor} text={props.actor} />
    <span>{props.actor}</span>
    <span>promoted</span>
    <span>{props.build}</span>
    <span>promoted</span>
    <span>{props.target}</span>
  </div>
);

const Activity = (props) => {
  const { namespace: drilledNamespace, name: drilledName } = props;
  const { namespace: hookNamespace, name: hookName } = useParams();
  const namespace = hookNamespace || drilledNamespace;
  const name = hookName || drilledName;
  switch (props.event) {
    case 'pull_request':
      return PullRequestActivity({ ...props, namespace, name });
    case 'tag':
      return TagActivity(props);
    case 'promote':
      return PromoteActivity(props);
    case 'rollback':
      return RollbackActivity(props);
    default:
      return PushActivity({ ...props, namespace, name });
  }
};

Activity.propTypes = {
  className: PropTypes.string,
  number: PropTypes.number,
  event: PropTypes.string,
  action: PropTypes.string,
  actor: PropTypes.string,
  avatar: PropTypes.string,
  commit: PropTypes.string,
  branch: PropTypes.string,
  target: PropTypes.string,
  refs: PropTypes.string,
};

Activity.defaultProps = {
  className: undefined,
  number: undefined,
  event: undefined,
  action: undefined,
  actor: undefined,
  avatar: undefined,
  commit: undefined,
  branch: undefined,
  target: undefined,
  refs: undefined,
};

export default Activity;

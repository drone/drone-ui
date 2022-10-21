import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { instance } from '_constants';
import Avatar from 'components/shared/avatar';
import {
  CommitLabel,
  CronLabel,
  BranchLabel,
  BuildLabel,
  EnvironmentLabel,
  PullRequestLabel,
  TagLabel,
} from 'components/shared/label';

import styles from './simple.module.scss';

const cx = classNames.bind(styles);

function wrapReferenceLink(child, {
  namespace, name, refs, deeplink,
}) {
  return deeplink === true ? (
    <a href={`${instance}/link/${namespace}/${name}/tree/${refs}`} target="_blank" rel="noreferrer noopener">{child}</a>
  ) : child;
}

function wrapCommitLink(child, {
  namespace, name, commit, deeplink,
}) {
  return deeplink === true ? (
    <a href={`${instance}/link/${namespace}/${name}/commit/${commit}`} target="_blank" rel="noreferrer noopener">{child}</a>
  ) : child;
}

function wrapBuildLink(child, {
  namespace, name, number, deeplink,
}) {
  return deeplink === true ? (
    <a href={`/${namespace}/${name}/${number}`}>{child}</a>
  ) : child;
}

const PushActivity = ({
  className, avatar, actor, commit, branch, namespace, name, deeplink, refs,
}) => (
  <div className={cx('activity', className)}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar path={avatar} alt={actor} text={actor} className={cx('avatar')} />
      <span className={cx('info')}>{actor}</span>
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>pushed</span>
      {wrapCommitLink(<CommitLabel className={cx('label')} commit={commit.substr(0, 8)} />, {
        namespace, name, commit, deeplink,
      })}
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>to</span>
      {wrapReferenceLink(<BranchLabel className={cx('label')} branch={branch} />, {
        namespace, name, refs, deeplink,
      })}
    </div>
  </div>
);

const PullRequestActivity = ({
  className, avatar, actor, branch, action, refs, namespace, name, deeplink,
}) => (
  <div className={cx('activity', className)}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar path={avatar} alt={actor} text={actor} className={cx('avatar')} />
      <span className={cx('info')}>{actor}</span>
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>{action === 'opened' ? 'opened' : 'synchronized'}</span>
      <span className={cx('info')}>pull request</span>
      {wrapReferenceLink(<PullRequestLabel className={cx('label')} pr={refs} />, {
        namespace, name, refs, deeplink,
      })}
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>to</span>
      {wrapReferenceLink(<BranchLabel className={cx('label')} branch={branch} />, {
        namespace, name, refs, deeplink,
      })}
    </div>
  </div>
);

const TagActivity = ({
  className, avatar, actor, refs, namespace, name, deeplink,
}) => (
  <div className={cx('activity', className)}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar path={avatar} alt={actor} text={actor} className={cx('avatar')} />
      <span className={cx('info')}>{actor}</span>
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>created</span>
      {wrapReferenceLink(<TagLabel className={cx('label')} tag={refs} />, {
        namespace, name, refs, deeplink,
      })}
    </div>
  </div>
);

const PromoteActivity = ({
  className, namespace, name, deeplink, parent, target, trigger,
}) => (
  <div className={cx('activity', className || '')}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar alt={trigger} text={trigger} className={cx('avatar')} />
      <span className={cx('info')}>{trigger}</span>
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>promoted build</span>
      {wrapBuildLink(<BuildLabel className={cx('label')} build={parent} />, {
        namespace, name, number: parent, deeplink,
      })}
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>to</span>
      <EnvironmentLabel className={cx('label')} environment={target} />
    </div>
  </div>
);

const RollbackActivity = ({
  className, avatar, actor, namespace, name, commit, deeplink, target, parent,
}) => (
  <div className={cx('activity', className)}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar path={avatar} alt={actor} text={actor} className={cx('avatar')} />
      <span className={cx('info')}>{actor}</span>
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>rolled back</span>
      <EnvironmentLabel className={cx('label')} environment={target} />
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>to build</span>
      {wrapBuildLink(<BuildLabel className={cx('label')} build={parent} />, {
        namespace, name, commit, deeplink,
      })}
    </div>
  </div>
);

const CronActivity = ({
  className, avatar, actor, cron,
}) => (
  <div className={cx('activity', className)}>
    <div className={cx('chunk')} data-type="chunk">
      <Avatar path={avatar} alt={actor} text={actor} className={cx('avatar')} />
    </div>
    <div className={cx('chunk')} data-type="chunk">
      <span className={cx('info')}>executed scheduled task</span>
      <CronLabel className={cx('label')} name={cron} />
    </div>
  </div>
);

const SimpleActivity = (props) => {
  switch (props.event) {
    case 'pull_request':
      return PullRequestActivity(props);
    case 'tag':
      return TagActivity(props);
    case 'promote':
      return PromoteActivity(props);
    case 'rollback':
      return RollbackActivity(props);
    case 'cron':
      return CronActivity(props);
    default:
      return PushActivity(props);
  }
};

SimpleActivity.propTypes = {
  className: PropTypes.string,
  deeplink: PropTypes.bool,
  namespace: PropTypes.string,
  name: PropTypes.string,
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

SimpleActivity.defaultProps = {
  className: undefined,
  deeplink: undefined,
  namespace: undefined,
  name: undefined,
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

PushActivity.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired,
  commit: PropTypes.string,
  branch: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deeplink: PropTypes.bool,
  refs: PropTypes.string.isRequired,
};

PushActivity.defaultProps = {
  className: '',
  commit: undefined,
  branch: undefined,
  deeplink: undefined,
};

PullRequestActivity.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired,
  branch: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deeplink: PropTypes.bool,
  refs: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

PullRequestActivity.defaultProps = {
  className: '',
  branch: undefined,
  deeplink: undefined,
};

TagActivity.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deeplink: PropTypes.bool,
  refs: PropTypes.string.isRequired,
};

TagActivity.defaultProps = {
  className: '',
  deeplink: undefined,
};

PromoteActivity.propTypes = {
  className: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deeplink: PropTypes.bool,
  parent: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  trigger: PropTypes.string.isRequired,
};

PromoteActivity.defaultProps = {
  className: '',
  deeplink: undefined,
};

RollbackActivity.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired,
  commit: PropTypes.string,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  deeplink: PropTypes.bool,
  parent: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
};

RollbackActivity.defaultProps = {
  className: '',
  commit: undefined,
  deeplink: undefined,
};

CronActivity.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired,
  cron: PropTypes.string.isRequired,
};

CronActivity.defaultProps = {
  className: '',
};

export default SimpleActivity;

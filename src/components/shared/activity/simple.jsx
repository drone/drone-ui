import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Avatar from 'components/shared/avatar';
import {
  CommitLabel,
  BranchLabel,
  BuildLabel,
  EnvironmentLabel,
  PullRequestLabel,
  TagLabel,
} from 'components/shared/label';

import styles from './simple.module.scss';

const cx = classNames.bind(styles);

const PushActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <p style={{ display: 'inline-flex' }}>
      <Avatar path={props.avatar} alt={props.actor} text={props.actor} className={cx('avatar')} />
      <span>{props.actor}</span>
    </p>
    <p>
      <span>pushed</span>
      {wrapCommitLink(<CommitLabel className={cx('label')} commit={props?.commit.substr(0, 8)} />, props)}
    </p>
    <p>
      <span>to</span>
      {wrapReferenceLink(<BranchLabel className={cx('label')} branch={props?.branch} />, props)}
    </p>
  </div>
);

const PullRequestActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <p>
      <Avatar path={props.avatar} alt={props.actor} text={props.actor} className={cx('avatar')} />
      <span>{props.actor}</span>
    </p>
    <p>
      <span>{props.action == 'opened' ? 'opened' : 'synchronized'}</span>
      <span>pull request</span>
      {wrapReferenceLink(<PullRequestLabel className={cx('label')} pr={props.refs} />, props)}
    </p>
    <p>
      <span>to</span>
      {wrapReferenceLink(<BranchLabel className={cx('label')} branch={props?.branch} />, props)}
    </p>
  </div>
);

const TagActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <p>
      <Avatar path={props.avatar} alt={props.actor} text={props.actor} className={cx('avatar')} />
      <span>{props.actor}</span>
    </p>
    <p>
      <span>created</span>
      {wrapReferenceLink(<TagLabel className={cx('label')} tag={props.refs} />, props)}
    </p>
  </div>
);

const PromoteActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <p>
      <Avatar path={props.avatar} alt={props.actor} text={props.actor} className={cx('avatar')} />
      <span>{props.sender}</span>
    </p>
    <p>
      <span>promoted build</span>
      {wrapBuildLink(<BuildLabel className={cx('label')} build={props.number} />, props)}
    </p>
    <p>
      <span>to</span>
      <EnvironmentLabel className={cx('label')} environment={props.target} />
    </p>
  </div>
);

const RollbackActivity = (props) => (
  <div className={cx('activity', props.className || '')}>
    <p>
      <Avatar path={props.avatar} alt={props.actor} text={props.actor} className={cx('avatar')} />
      <span>{props.actor}</span>
    </p>
    <p>
      <span>rolled back</span>
      <EnvironmentLabel className={cx('label')} environment={props.target} />
    </p>
    <p>
      <span>to build</span>
      {wrapBuildLink(<BuildLabel className={cx('label')} build={props.number} />, props)}
    </p>
  </div>
);

// eslint-disable-next-line
function wrapReferenceLink(child, { namespace, name, refs, deeplink }) {
  return deeplink === true ? (
    <a href={`/link/${namespace}/${name}/tree/${refs}`} target="_blank">{child}</a>
  ) : child;
}

// eslint-disable-next-line
function wrapCommitLink(child, { namespace, name, commit, deeplink }) {
  return deeplink === true ? (
    <a href={`/link/${namespace}/${name}/commit/${commit}`} target="_blank">{child}</a>
  ) : child;
}

// eslint-disable-next-line
function wrapBuildLink(child, { namespace, name, number, deeplink }) {
  return deeplink === true ? (
    <a href={`/${namespace}/${name}/${number}`}>{child}</a>
  ) : child;
}

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

export default SimpleActivity;

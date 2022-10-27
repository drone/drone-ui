import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as Clock } from 'svg/clock.svg';
import { ReactComponent as Box } from 'svg/scm/box.svg';
import { ReactComponent as Branch } from 'svg/scm/branch.svg';
import { ReactComponent as Commit } from 'svg/scm/commit.svg';
import { ReactComponent as Number } from 'svg/scm/number.svg';
import { ReactComponent as PullRequest } from 'svg/scm/pr.svg';
import { ReactComponent as Tag } from 'svg/scm/tag.svg';

import styles from './label.module.scss';

const cx = classNames.bind(styles);

/**
 * Label renders a label for an activity based on the event type.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.event
 * @param {string} props.commit
 * @param {string} props.branch
 * @param {string} props.ref
 * @param {string} props.environment
 */
/* eslint-disable */
export const Label = ({ className, event, commit, branch, refs, environment }) => {
  switch (event) {
    case "pull_request":
      return <PullRequestLabel className={className} pr={refs} />
    case "tag":
      return <TagLabel className={className} tag={refs} />
    case "promote":
    case "rollback":
      return <EnvironmentLabel className={className} environment={environment} />
    case "cron":
    case "custom":
    case "push":
      return <BranchLabel className={className} branch={branch} />
    default:
      return <CommitLabel className={className} commit={commit} />
  }
};

/**
 * CommitLabel renders a label for a commit hash.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.commit
 */
export const CommitLabel = ({ className, commit }) => {
  return (
    <div className={cx('root', className || '')}>
      <Commit />
      {commit}
    </div>
  );
};

/**
 * BranchLabel renders a label for a branch.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.branch
 */
export const BranchLabel = ({ className, branch }) => {
  return (
    <div className={cx('root', className || '')}>
      <Branch />
      {branch}
    </div>
  );
};

/**
 * PullRequestLabel renders a label for a pull request.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.pr
 */
export const PullRequestLabel = ({ className, pr }) => {
  return (
    <div className={cx('root', className || '')}>
      <PullRequest />
      <sub>#</sub>
      {extractNumber(pr)}
    </div>
  );
};

/**
 * TagLabel renders a label for a tag.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.tag
 */
export const TagLabel = ({ className, tag }) => {
  return (
    <div className={cx('root', className || '')}>
      <Tag />
      {trimRef(tag)}
    </div>
  );
};

/**
 * EnvironmentLabel renders a label for an environment.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.pr
 */
export const EnvironmentLabel = ({ className, environment }) => {
  return (
    <div className={cx('root', className || '')}>
      <Box />
      {environment}
    </div>
  );
};

/**
 * CronLabel renders a label for a cron execution.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.name
 */
export const CronLabel = ({ className, name }) => {
  return (
    <div className={cx('root', className || '')}>
      <Clock />
      {name}
    </div>
  );
};

/**
 * BuildLabel renders a label for a build.
 * @param {object} props Component props
 * @param {string} props.className
 * @param {string} props.pr
 */
export const BuildLabel = ({ className, build }) => {
  return (
    <div className={cx('root', className || '')}>
      <Number />
      {build}
    </div>
  );
};

/**
 * Trim the reference to return the object name.
 * @param {string} ref reference path
 */
function trimRef(ref) {
  return ref?.replace("refs/heads/", "")?.replace("refs/tags/", "")
}

/**
 * Extract the pull request number from the reference.
 * @param {string} ref reference path
 */
function extractNumber(ref) {
  return ref?.match(/\d+/g)
}

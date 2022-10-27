import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import { ReactComponent as CanceledIcon } from 'svg/status/canceled.svg';
import { ReactComponent as FailureIcon } from 'svg/status/failure.svg';
import { ReactComponent as InactiveIcon } from 'svg/status/inactive.svg';
import { ReactComponent as RunningIcon } from 'svg/status/running.svg';
import { ReactComponent as SuccessIcon } from 'svg/status/success.svg';

import styles from './status.module.scss';

const cx = classNames.bind(styles);

const getBadgeStatus = (stepStatus) => {
  switch (stepStatus) {
    case 'failure':
      return 'failed';
    case 'waiting_on_dependencies':
      return 'waiting';
    default:
      return stepStatus;
  }
};

const StatusBadge = ({ className, status }) => (
  <span className={cx('status-label', `status-label-${status}`, className || '')}>
    {getBadgeStatus(status)}
  </span>
);

const getStatusIcon = (status) => {
  switch (status) {
    case 'error':
    case 'failure':
      return <FailureIcon />;
    case 'killed':
    case 'declined':
    case 'skipped':
      return <CanceledIcon />;
    case 'running':
    case 'pending':
    case 'waiting_on_dependencies':
    case 'blocked':
      return <RunningIcon />;
    case 'success':
      return <SuccessIcon />;
    case 'inactive':
      return <InactiveIcon />;
    default:
      return null;
  }
};

const Status = ({ className, status }) => (
  <div
    className={cx('status', `status-${status}`, className || '')}
    title={`Status: ${status}`}
  >
    {getStatusIcon(status)}
  </div>
);

Status.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
};

Status.defaultProps = {
  className: undefined,
  status: undefined,
};

export default Status;
export { StatusBadge };

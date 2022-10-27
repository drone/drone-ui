import classNames from 'classnames/bind';
import React from 'react';

import { isLicenseExceeded, isLicenseExpired } from '_constants';
import SystemMessage from 'components/shared/system-message';

import styles from './license.module.scss';

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <>
      {isLicenseExpired && (
        <div className={cx('system-messages-wrapper')}>
          <SystemMessage intent="danger" className={cx('message-with-link')}>
            Your Server License is Expired.
            <a
              href="https://docs.drone.io/license-is-expired"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more

            </a>
          </SystemMessage>
        </div>
      )}
      {isLicenseExceeded && (
        <div className={cx('system-messages-wrapper')}>
          <SystemMessage intent="danger" className={cx('message-with-link')}>
            Your License Limit is Exceeded.
            <a
              href="https://docs.drone.io/license-is-exceeded"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
            or
            <a
              href="https://drone.io/enterprise"
              target="_blank"
              rel="noopener noreferrer"
            >
              Purchase License

            </a>
          </SystemMessage>
        </div>
      )}
    </>
  );
}

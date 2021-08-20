import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './system-message.module.scss';

const cx = classNames.bind(css);

const SystemMessage = (props) => {
  const { className, intent, children } = props;
  return (
    <div className={cx('wrapper', `wrapper-${intent}`, className)}>
      {children}
    </div>
  );
};

SystemMessage.propTypes = {
  className: PropTypes.string,
  intent: PropTypes.oneOf(['warning', 'danger', 'success']),
  children: PropTypes.node.isRequired,
};

SystemMessage.defaultProps = {
  className: '',
  intent: 'success',
};

export default SystemMessage;

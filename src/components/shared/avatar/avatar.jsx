import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import styles from './avatar.module.scss';

const cx = classNames.bind(styles);

const AVATAR_STUB_BACKGROUND_COLORS = [
  // green
  '#06C270',
  // blue
  '#0063F7',
  // orange
  '#FF8800',
  // teal
  '#06B7C4',
  // violet
  '#4D0B8F',
];

const Avatar = ({
  className, path, alt, text,
}) => {
  const [hasImageFailedToLoad, setHasImageFailedToLoad] = useState(false);
  const handleImageError = () => setHasImageFailedToLoad(true);
  let content;
  if (!path || hasImageFailedToLoad) {
    const textToUse = text || alt || '?';
    content = (
      <span
        className={cx('stub')}
        title={textToUse}
        style={{
          backgroundColor:
            AVATAR_STUB_BACKGROUND_COLORS[textToUse.charCodeAt(0) % AVATAR_STUB_BACKGROUND_COLORS.length],
        }}
      >
        {text[0]}
      </span>
    );
  } else {
    content = <img className={cx('image')} src={path} alt={alt} onError={handleImageError} />;
  }
  return (
    <div className={cx('wrapper', className || '')}>
      {content}
    </div>
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  path: PropTypes.string,
  alt: PropTypes.string,
};

Avatar.defaultProps = {
  className: undefined,
  path: undefined,
  alt: 'User avatar',
};

export default Avatar;

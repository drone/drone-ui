import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './header.module.scss';

const cx = classNames.bind(styles);

const buildBreadcrumbs = ({ namespace, name, build }) => {
  if (!namespace || !name) return null;
  const repo = !build ? <span>{`${namespace}/${name}`}</span> : (
    <Link to={`/${namespace}/${name}`}>
      {namespace}
      /
      {name}
    </Link>
  );
  return (
    <nav className={cx('header-row', 'breadcrumbs')}>
      <Link to="/">Repositories</Link>
      {repo}
      {build && (
        <span>
          #
          {build}
        </span>
      )}
    </nav>
  );
};

const Header = (props) => {
  const {
    title, buttonsProps, showBackToFeed, namespace, name, build,
  } = props;
  // breadcrumbs part
  const breadcrumbs = buildBreadcrumbs({ namespace, name, build });
  // buttons part
  const buttons = buttonsProps.length ? (
    <div className={cx('buttons')}>
      {buttonsProps
        .map(({ label, as = 'button', ...rest }) => (as === 'button' ? (
          // eslint-disable-next-line react/no-array-index-key
          <button type="button" key={label} {...rest}>
            {label}
          </button>
        ) : (
          <a key={label} {...rest} target="_blank">{label}</a>
        )))}
    </div>
  ) : null;
  // back to feed
  const backToFeed = showBackToFeed ? <Link className={cx('back-to-feed')} to={`/${namespace}/${name}`}>Activity feed</Link> : null;
  // heading
  const heading = title ? (
    <h1 className={cx('heading')}>{title}</h1>
  ) : null;

  return (
    <header className={cx('header', props.className || '')}>
      <nav className={cx('header-row')}>
        {breadcrumbs}
      </nav>
      <div className={cx('header-row')}>
        {heading}
        {buttons}
      </div>
      <div className={cx('header-row')}>
        {backToFeed}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  buttonsProps: PropTypes.arrayOf(PropTypes.shape({})),
  showBackToFeed: PropTypes.bool,
  namespace: PropTypes.string,
  name: PropTypes.string,
  build: PropTypes.string,
};
Header.defaultProps = {
  title: undefined,
  buttonsProps: [],
  showBackToFeed: false,
  namespace: undefined,
  name: undefined,
  build: undefined,
};

export default Header;

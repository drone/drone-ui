import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef, useMemo } from 'react'; // eslint-disable-line
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import Button from 'components/shared/button';
import { useOnClickOutside } from 'hooks';
import { useStore } from 'hooks/store';
import { ReactComponent as ArrowBack } from 'svg/arrow.svg';
import { ReactComponent as SearchIcon } from 'svg/search.svg';
import { searchRepos, sortRepos } from 'utils';

import styles from './search-drawer.module.scss';

const cx = classNames.bind(styles);

const SearchCard = ({ query, slug, handleLinkClick }) => (
  <div className={cx('search-card-wrapper')}>
    <div className={cx('search-card-left')}>
      <SearchIcon />
    </div>
    <div className={cx('search-card-right')}>
      <span className={cx('search-card-kicker')}>
        Found &quot;
        <b>{query}</b>
        &quot; in
        {' '}
        <b>Repositories</b>
      </span>
      <p className={cx('search-card-content')}>
        <Link to={`/${slug}`} onClick={handleLinkClick}>{slug}</Link>
      </p>
    </div>
  </div>
);

SearchCard.propTypes = {
  query: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

const SearchDrawer = ({ isShown, hide }) => {
  const { repos, reloadOnce } = useStore();
  const data = useMemo(() => (repos ? Object.values(repos) : undefined), [repos]);
  useEffect(() => reloadOnce(), [reloadOnce]);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const drawerRef = useRef();

  const hideSearchDrawer = () => {
    drawerRef.current.classList.add(cx('slide-out'));
    setQuery('');
    setTimeout(hide, 200);
  };

  useOnClickOutside(drawerRef, hideSearchDrawer);

  const handleSearchInput = (e) => setQuery(e.target.value.trim());

  useEffect(() => {
    if (isShown) {
      drawerRef.current.querySelector('input').focus();
    }
  }, [isShown]);

  useEffect(() => {
    if (!query.length) setResults([]);
    if (query.length && data?.length) {
      const searchResults = searchRepos(sortRepos(data), query);
      setResults(searchResults);
    }
  }, [query, data]);

  let content;
  if (query.length && !results.length) {
    content = <p>Repos not found</p>;
  } else if (results.length) {
    content = results.map(({ slug, id }) => (
      <SearchCard key={id} slug={slug} query={query} handleLinkClick={hideSearchDrawer} />
    ));
  }

  if (isShown) {
    return ReactDOM.createPortal(
      <div ref={drawerRef} className={cx('wrapper')}>
        <div className={cx('header')}>
          <Button
            tabIndex={0}
            className={cx('back-btn')}
            theme="plain"
            onClick={hideSearchDrawer}
          >
            <ArrowBack />
          </Button>
          <input
            tabIndex={0}
            className={cx('input')}
            type="text"
            placeholder="Search repositories"
            onChange={handleSearchInput}
          />
        </div>
        <div className={cx('wrapper-results')}>
          <span className={cx('kicker')}>Search results</span>
          <div className={cx('results')}>
            {content}
          </div>
        </div>
      </div>,
      document.body,
    );
  }
  return null;
};

SearchDrawer.propTypes = {
  isShown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default SearchDrawer;

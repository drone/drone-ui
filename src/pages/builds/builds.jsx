import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useLayoutEffect,
} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import BuildList from 'components/pages/repo/build-list';
import Button from 'components/shared/button';
import ZeroState from 'components/shared/zero-state';
import { useCustomTitle } from 'hooks';
import { useBuilds } from 'hooks/swr';

import styles from './builds.module.scss';
import Summary from './summary';

const cx = classNames.bind(styles);

export default function Builds({ repo }) {
  const { active: isRepoActive } = repo;
  const { params: { namespace, name }, url } = useRouteMatch();
  const history = useHistory();

  // if repo is inactive, redirect to settings where
  // user can proceed with repo activation
  useLayoutEffect(() => {
    if (!isRepoActive) {
      history.replace(`/${namespace}/${name}/settings`);
    }
  }, [isRepoActive, history, namespace, name]);

  const {
    data, isError, isEndReached, isLoading, size, setSize,
  } = useBuilds({ namespace, name });

  useCustomTitle(`${namespace}/${name}`);

  if (isError && isError.message === 'Not Found') {
    history.push('/404');
  }

  const handleShowMoreClick = () => setSize(size + 1);

  let content = null;
  if (isLoading) {
    // TODO(bradrydzewski) set the content to a loading indicator
    // once we have the mockups from the design team.
    content = null;
  } else if (data.length) {
    content = (
      <section className={cx('wrapper')}>
        <h2 className={cx('section-title')}>Summary</h2>
        <Summary data={data} totalBuildsCounter={repo?.counter} className={cx('summary')} />
        <h2 className={cx('section-title')}>Executions</h2>
        <BuildList data={data} url={url} />
        {(!isLoading && !isEndReached && data.length) ? (
          <div>
            <Button className={cx('btn', 'btn-show-more')} onClick={handleShowMoreClick}>Show more &#8595;</Button>
          </div>
        ) : null}
      </section>
    );
  } else {
    content = (
      <ZeroState
        title="Your Build List is Empty."
        message="Press the New Build button to execute your first build pipeline."
      />
    );
  }

  return (
    <>
      {content}
    </>
  );
}

Builds.propTypes = {
  repo: PropTypes.shape({
    active: PropTypes.bool || undefined,
    counter: PropTypes.number || undefined,
  }),
};

Builds.defaultProps = {
  repo: {
    active: undefined,
    counter: undefined,
  },
};

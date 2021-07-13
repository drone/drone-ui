import classNames from 'classnames/bind';
import React, {
  useLayoutEffect, useMemo, useState
} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import BuildList from 'components/pages/repo/build-list';
import Button from 'components/shared/button';
import Select from 'components/shared/form/select';
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
  const [event, setEvent] = useState('');

  // if repo is inactive, redirect to settigns where
  // user can proceed with repo activation
  useLayoutEffect(() => {
    if (!isRepoActive) {
      history.replace(`/${namespace}/${name}/settings`);
    }
  }, [isRepoActive, history, namespace, name]);

  const {
    data, isError, isEndReached, isLoading, size, setSize,
  } = useBuilds({ namespace, name });

  const filtered = useMemo(
    () => data?.slice(0)
      .filter((build) => event === "" || build.event === event) ?? [],
    [data, event],
  );

  useCustomTitle(`${namespace}/${name}`);

  if (isError && isError.message === 'Not Found') {
    history.push('/404');
  }

  const handleShowMoreClick = () => setSize(size + 1);
  const handleEvent = (e) => setEvent(e.target.value.trim());

  let inner = null;
  if (isLoading) {
    // TODO(bradrydzewski) set the content to a loading indicator
    // once we have the mockups from the design team.
    inner = null;
  } else if (filtered.length) {
    inner = (
      <section className={cx('wrapper')}>
        <h2 className={cx('section-title')}>Summary</h2>
        <Summary data={filtered} totalBuildsCounter={repo?.counter} className={cx('summary')} />
        <h2 className={cx('section-title')}>Executions</h2>

        <BuildList data={filtered} url={url} />
        {(!isLoading && !isEndReached && filtered.length) ? (
          <div>
            <Button className={cx('btn', 'btn-show-more')} onClick={handleShowMoreClick}>Show more &#8595;</Button>
          </div>
        ) : null}
      </section>
    );
  } else {
    inner = (
      <ZeroState title="Your Build List is Empty." message="Press the New Build button to execute your first build pipeline." />
    );
  }

  let content = (
    <div>
      <div className={cx('actions')}>
        Event
        <Select
          optionsList={[{ key: "All", value: "" }, { key: "Cron Job", value: "cron" }, { key: "Pull Request", value: "pull_request" }, { key: "Push", value: "push" }]}
          className={cx('select')}
          width={200}
          onChange={handleEvent}
        />

      </div>
      {inner}
    </div>
  );

  return (
    <>
      {content}
    </>
  );
}

import classNames from 'classnames/bind';
import React, {
  useEffect, useState, useMemo, useContext,
} from 'react';

import { isLicenseExceeded, isLicenseExpired } from '_constants';
import Repos from 'components/pages/home/repos';
import ReposRecent from 'components/pages/home/repos-recent';
import Button from 'components/shared/button';
import Input from 'components/shared/form/input';
import Switch from 'components/shared/switch';
import SystemMessage from 'components/shared/system-message';
import ZeroState from 'components/shared/zero-state';
import { AppContext } from 'context';
import { useLocalStorage, useCustomTitle, useToast } from 'hooks';
import { useViewer, useLatestRepos, useSyncAccount } from 'hooks/swr';
import { byBuildCreatedAtDesc, byRepoNameAsc } from 'utils';

import styles from './home.module.scss';

const cx = classNames.bind(styles);

// amount of repos to be shown initially and increased by
// on show more click
const REPOS_CHUNK_SIZE = 50;

export default function Home({ user }) {
  const [context, setContext] = useContext(AppContext);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [isActiveOnly, setIsActiveOnly] = useLocalStorage('home_show_active_only_repos', false);
  const [shouldStartSync, setShouldStartSync] = useState(context.isAccSyncing);
  const { showError } = useToast();
  const { hasSyncReqFiredOff, isError: syncError } = useSyncAccount(shouldStartSync);

  const { data, isLoading, mutate } = useLatestRepos(!!user);
  const { isSynced, isSyncing, isError: viewerError } = useViewer({ withPolling: hasSyncReqFiredOff });

  useCustomTitle();

  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () => data?.slice(0)
      .filter((repo) => (isActiveOnly ? !!repo.build : !!repo))
      .filter((item) => item.slug.indexOf(filter) > -1) ?? [],
    [data, filter, isActiveOnly],
  );

  const sorted = useMemo(
    () => filtered
      .slice(0)
      .sort(byRepoNameAsc)
      .slice(0, showAllRepos ? filtered.length : REPOS_CHUNK_SIZE) ?? [],
    [filtered, showAllRepos],
  );

  const recent = useMemo(
    () => data?.slice(0).sort(byBuildCreatedAtDesc).filter((repo) => !!repo.build)?.slice(0, 6) ?? [],
    [data],
  );

  useEffect(() => {
    if (syncError || viewerError) {
      setContext({ ...context, isAccSyncing: false });
      showError('Sync error has occured, please, try again');
      console.error('Sync error:', syncError?.message || viewerError?.message); // eslint-disable-line no-console
    }
  }, [syncError, viewerError, showError, context, setContext]);

  useEffect(() => {
    if (isSynced) {
      setShouldStartSync(false);
      mutate();
      if (context.isAccSyncing) {
        setContext({ ...context, isAccSyncing: false });
      }
    }
  }, [isSynced, context, setContext, mutate]);

  const handleSyncClick = () => setShouldStartSync(true);

  const handleLoadMoreClick = () => setShowAllRepos(true);

  const handleFilter = (e) => setFilter(e.target.value.trim());

  let content = null;

  if (isLoading) {
    content = null;
  } else if (data?.length) {
    content = (
      <>
        <div className={cx('subheader')}>
          <h2 className={cx('section-title')}>Repositories</h2>
          <div className={cx('actions')}>
            <Switch
              id="active-switch"
              checked={isActiveOnly}
              onChange={(val) => setIsActiveOnly(val)}
            >
              Active Only

            </Switch>
            <Input
              placeholder="Filter …"
              icon="search"
              className={cx('search')}
              width={300}
              name="repo-search"
              onChange={handleFilter}
            />
          </div>
        </div>
        <Repos repos={sorted} />
        {!showAllRepos && sorted.length >= REPOS_CHUNK_SIZE && (
        <Button
          className={cx('btn', 'btn-show-more')}
          onClick={handleLoadMoreClick}
        >
          Show more &#8595;
        </Button>
        )}
      </>
    );
  } else {
    content = (
      <ZeroState
        title="Your Repository List is Empty."
        message="Drone automatically syncs with your version control system to display your repositories."
      />
    );
  }

  return (
    <>
      <header className={cx('header')}>
        <h1>Dashboard</h1>
        <button
          type="button"
          className={cx('btn', 'btn-sync')}
          disabled={isSyncing || hasSyncReqFiredOff}
          onClick={handleSyncClick}
        >
          {(isSyncing || hasSyncReqFiredOff) && (
            <span className={cx('btn-sync-spinner')} />
          )}
          {(isSyncing || hasSyncReqFiredOff) ? 'Syncing' : 'Sync'}
        </button>
      </header>
      <div
        className={cx('system-messages-wrapper')}
        hidden={!isLicenseExceeded && !isLicenseExpired}
      >
        {isLicenseExpired && (
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
        )}
        {isLicenseExceeded && (
        <SystemMessage intent="danger" className={cx('message-with-link')}>
          Your License Limit is Exceeded.
          <a
            href="https://docs.drone.io/license-is-exceeded"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </SystemMessage>
        )}
      </div>
      <section className={cx('wrapper')}>
        {!!recent.length && (
        <>
          <h2 className={cx('section-title', 'section-title-recent')}>Recent Activity</h2>
          <ReposRecent repos={recent} />
        </>
        )}
        {content}
      </section>
    </>
  );
}

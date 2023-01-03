import classNames from 'classnames/bind';
import React, {
  useEffect, useState, useMemo, useContext,
} from 'react';

import Repos from 'components/pages/home/repos';
import ReposRecent from 'components/pages/home/repos-recent';
import Button from 'components/shared/button';
import Input from 'components/shared/form/input';
import Select from 'components/shared/form/select';
import Switch from 'components/shared/switch';
import ZeroState from 'components/shared/zero-state';
import { AppContext } from 'context';
import { useLocalStorage, useCustomTitle, useToast } from 'hooks';
import { useStore } from 'hooks/store';
import { useViewer, useSyncAccount } from 'hooks/swr';
import { byBuildCreatedAtDesc, byRepoNameAsc } from 'utils';

import styles from './home.module.scss';

const cx = classNames.bind(styles);

// amount of repos to be shown initially and increased by
// on show more click
const REPOS_CHUNK_SIZE = 50;

const RECENT_ACTIVITY = 'Sort by Recent activity';
const NAME = 'Sort by Name';
const sortEnums = [RECENT_ACTIVITY, NAME];

export default function Home() {
  const [context, setContext] = useContext(AppContext);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [isActiveOnly, setIsActiveOnly] = useLocalStorage('home_show_active_only_repos', false);
  const [sortBy, setSortBy] = useLocalStorage('home_sort_repos_by', sortEnums[0]);
  const [filterOrg, setFilterOrg] = useLocalStorage('home_org_repos', '');
  const [shouldStartSync, setShouldStartSync] = useState(context.isAccSyncing);
  const { showError } = useToast();
  const { hasSyncReqFiredOff, isError: syncError } = useSyncAccount(shouldStartSync);

  const { isSynced, isSyncing, isError: viewerError } = useViewer({ withPolling: hasSyncReqFiredOff });

  const {
    repos, orgs, error, reload, reloadOnce,
  } = useStore();
  const data = repos ? Object.values(repos) : undefined;
  const isLoading = !data && !error;
  useEffect(() => reloadOnce(), [reloadOnce]);
  useCustomTitle();

  const [filter, setFilter] = useState('');

  const filtered = useMemo(
    () => data?.slice(0)
      .filter((repo) => (isActiveOnly ? repo.active : !!repo))
      .filter((repo) => (filterOrg ? repo.namespace === filterOrg : !!repo))
      .filter((item) => item.slug.indexOf(filter) > -1) ?? [],
    [data, filter, isActiveOnly, filterOrg],
  );

  const sorted = useMemo(
    () => filtered
      .slice(0)
      .sort(sortBy === NAME ? byRepoNameAsc : byBuildCreatedAtDesc)
      .slice(0, showAllRepos ? filtered.length : REPOS_CHUNK_SIZE) ?? [],
    [filtered, showAllRepos, sortBy],
  );

  const recent = useMemo(
    () => data?.slice(0).sort(byBuildCreatedAtDesc).filter((repo) => !!repo.build)?.slice(0, 6) ?? [],
    [data],
  );

  const orgOptions = useMemo(() => {
    if (!orgs) return [{ value: '', key: 'All Organizations' }];
    const returnOrgs = orgs?.map((org) => ({ value: org, key: org }));
    return [{ value: '', key: 'All Organizations' }, ...returnOrgs];
  }, [orgs]);

  const sortOptions = sortEnums.map((option) => ({ value: option, key: option }));

  useEffect(() => {
    if (syncError || viewerError) {
      setContext({ ...context, isAccSyncing: false });
      showError('Sync error has occurred, please, try again');
      console.error('Sync error:', syncError?.message || viewerError?.message); // eslint-disable-line no-console
    }
  }, [syncError, viewerError, showError, context, setContext]);

  useEffect(() => {
    if (isSynced) {
      setShouldStartSync(false);
      reload();
      if (context.isAccSyncing) {
        setContext({ ...context, isAccSyncing: false });
      }
    }
  }, [isSynced, context, setContext, reload]);

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
            <Select value={sortBy} optionsList={sortOptions} onChange={(e) => setSortBy(e.target.value)} />
            <Select value={filterOrg} optionsList={orgOptions} onChange={(e) => setFilterOrg(e.target.value)} />
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

import {
  useEffect, useState, useCallback,
} from 'react';
import {
  useSWRInfinite, mutate as mutateGlobal,
} from 'swr';

import { instance, token } from '_constants';
import { useStore } from 'hooks/store';

import useSWRBase from './use-swr-base';

const MAX_PAGE_LENGTH = 50;

const useBuilds = ({ namespace, name }) => {
  const getKey = (pageIndex, previousPageData) => {
    const index = pageIndex + 1;
    if (previousPageData && previousPageData.length < MAX_PAGE_LENGTH) {
      return null;
    }
    return `/api/repos/${namespace}/${name}/builds?page=${index}&per_page=${MAX_PAGE_LENGTH}`; // SWR key
  };

  const {
    data, size, setSize, error, mutate,
  } = useSWRInfinite(getKey);

  const isEndReached = data?.some((cluster) => {
    if (!cluster.length || cluster.length < MAX_PAGE_LENGTH) {
      return true;
    }
    return false;
  });

  return {
    isLoading: !error && !data,
    data: [].concat(...data || []),
    mutate,
    size,
    setSize,
    isEndReached,
    isError: error,
  };
};

const useBuild = ({ namespace, name, build }) => useSWRBase(`/api/repos/${namespace}/${name}/builds/${build}`);

/* useStreamBuildEvents helpers */

// pages that are sensitive to build events updates
// TODO WTF is this code
const streamDependants = [
  { regex: new RegExp(/^\/$/), page: 'Home' },
  { regex: new RegExp(/^\/builds-feed$/), page: 'BuildsFeed' },
  { regex: new RegExp(/^\/[a-zA-Z0-9-_.~]+?\/[a-zA-Z0-9-_.]+?$/), page: 'Builds' },
  { regex: new RegExp(/^\/[a-zA-Z0-9-_.~]+?\/[a-zA-Z0-9-_.]+?\/[0-9]+?(\/[0-9]+?\/[0-9]+?)?$/), page: 'Build' },
];

// latest repos updater
const updateLatestRepos = (repo) => (latest) => {
  // if there is no data in cache, do nothing
  if (!latest || !Array.isArray(latest) || !latest.length) {
    return latest;
  }
  const repoIndexInLatest = latest.findIndex(({ id }) => repo.id === id);
  // not found
  if (repoIndexInLatest < 0) {
    return latest;
  }
  if (!latest.build || latest.build.number <= repo.build.number) {
    if (repoIndexInLatest === 0) {
      return [repo, ...latest.slice(1)];
    }
    return [...latest.slice(0, repoIndexInLatest), repo, ...latest.slice(repoIndexInLatest + 1)];
  }
  return latest;
};

// activity feed updater
const updateBuilds = async (slug, repo, newBuild = null) => {
  if (`/${repo.namespace}/${repo.name}` !== slug) {
    // no need to do anything actually since user
    // is on the activity feed of another repo
    return;
  }
  // otherwise use cached builds data for the first 25 builds

  /* @TODO @NOTE
  / There should have been used simple key like
  / `/api/repos/${namespace}/${name}/builds?page=1',
  / but for some weird reason Builds page won't get its data
  / mutated using cached data stored for that key.
  /
  / I had to manually discover another key in swr's cache
  / and it works so far, but the issue has to be investigated nonetheless
  / as it is a severe crutch and is unstable by nature
  /
  / UPDATE 26.01.21: a couple of related issues
  / https://github.com/vercel/swr/issues/908
  / https://github.com/vercel/swr/issues/926
  /
  / probably, it makes sense to use paginated data without useSWR
  */
  const path = `arg@"many"@"/api/repos${slug}/builds?page=1&per_page=${MAX_PAGE_LENGTH}"`;
  mutateGlobal(path, async (builds) => {
    const build = newBuild ?? repo.build;
    /* if no cache or no data,
    / just return an array with received build
    */
    if (!builds?.length) {
      return [[build]];
    }
    const unwrappedBuilds = builds.flat();
    /* otherwise check if the first page includes
    / this particular build
    */
    const foundBuildIndex = unwrappedBuilds.findIndex(({ id }) => id === build.id);
    /* update the builds list
    */
    if (foundBuildIndex > 0) {
      return [[...unwrappedBuilds.slice(0, foundBuildIndex), build, ...unwrappedBuilds.slice(foundBuildIndex + 1)]];
    } if (!foundBuildIndex) {
      return [[build, ...unwrappedBuilds.slice(1)]];
    } if (unwrappedBuilds.length > MAX_PAGE_LENGTH) {
      return [[build, ...unwrappedBuilds.slice(0, unwrappedBuilds.length - 1)]];
    }
    return [[build, ...unwrappedBuilds]];
  },
  false);
};

const updateBuild = (location, repo) => {
  const [currentNamespace, currentName, currentBuildNumber] = location.split('/').filter(Boolean);
  const { namespace: eventNamespace, name: eventName, build: { number: eventBuildNumber } } = repo;
  // if current build matches event build params, do mutation
  if (currentNamespace === eventNamespace
      && currentName === eventName
      && +currentBuildNumber === eventBuildNumber
  ) {
    mutateGlobal(`/api/repos/${eventNamespace}/${eventName}/builds/${eventBuildNumber}`, async () => repo.build, false);
  }
};

// hook body
const useStreamBuildEvents = () => {
  const { update } = useStore();
  const [, setState] = useState();
  const forceRerender = useCallback(
    () => {
      setState();
    },
    [],
  );
  const handleEventSourceMessage = (event) => {
    const repo = JSON.parse(event.data);
    if (window.DEBUG) {
      /* eslint-disable no-console */
      console.debug('The server has sent an event:');
      console.debug(repo);
      /* eslint-enable no-console */
    }
    const location = window.location.pathname;
    const currentPage = streamDependants
      .find((dep) => dep.regex.test(location))?.page;

    switch (currentPage) {
      case 'Builds':
        updateBuilds(location, repo);
        break;
      case 'Build':
        updateBuild(location, repo);
        break;
      default:
    }

    mutateGlobal('/api/user/repos?latest=true', updateLatestRepos(repo), false);
    update(repo);
  };

  useEffect(() => {
    const path = `${instance}/api/stream${token ? `?access_token=${token}` : ''}`;
    const eventSource = new EventSource(path);
    eventSource.onmessage = handleEventSourceMessage;
    eventSource.onerror = forceRerender;
    return () => eventSource.close();
  }, [forceRerender]); // eslint-disable-line
};

export {
  useBuilds, useBuild, useStreamBuildEvents, updateBuilds,
};

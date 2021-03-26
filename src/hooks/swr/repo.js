import useSWRBase from './use-swr-base';

const useRepo = ({ namespace, name }) => useSWRBase(`/api/repos/${namespace}/${name}`);

const useLatestRepos = (shouldFetch = false) => useSWRBase(shouldFetch ? '/api/user/repos?latest=true' : null);

export { useRepo, useLatestRepos };

import useSWRBase from './use-swr-base';

const useRepo = ({ namespace, name }) => useSWRBase(`/api/repos/${namespace}/${name}`);

const useLatestRepos = () => useSWRBase('/api/user/repos?latest=true');

export { useRepo, useLatestRepos };

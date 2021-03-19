import useSWRBase from './use-swr-base';

export default ({ namespace, name }) => useSWRBase(`/api/repos/${namespace}/${name}/cron`);

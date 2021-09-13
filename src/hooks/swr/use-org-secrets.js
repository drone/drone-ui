import useSWRBase from './use-swr-base';

export default ({ namespace }) => useSWRBase(`/api/secrets/${namespace}`);

import useSWRBase from './use-swr-base';

export default ({ namespace }) => useSWRBase(`/api/templates/${namespace}`);

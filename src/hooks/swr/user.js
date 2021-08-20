import useSWRBase from './use-swr-base';

const useUserList = () => useSWRBase('/api/users');

export { useUserList };

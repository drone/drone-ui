import useSWR from 'swr';

/* basic useSWR setup that is shared among
 * fetcher hooks that require no additional setup
*/

const useSWRBase = (url) => {
  const { data, error, mutate } = useSWR(url);
  return {
    data,
    mutate,
    isError: error,
    isLoading: !error && !data,
  };
};

export default useSWRBase;

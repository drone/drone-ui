import useSWRBase from './use-swr-base';

export const useCards = ({ namespace, name, build }) => useSWRBase(`/api/repos/${namespace}/${name}/cards/${build}`);

export const useCard = ({
  namespace, name, build, stage, step,
}) => useSWRBase(`/api/repos/${namespace}/${name}/cards/${build}/${stage}/${step}/json`);

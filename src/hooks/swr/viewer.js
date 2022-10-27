import { useState, useEffect } from 'react';

import { axiosWrapper } from 'utils';

const useViewer = ({ withPolling = false, timeout = 10000 } = {}) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const fetchViewer = async () => {
    try {
      const res = await axiosWrapper('/api/user');
      setData(res);
      return res;
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    fetchViewer();
  }, []);

  useEffect(() => {
    let interval;
    if (withPolling && !isSynced) {
      interval = setInterval(async () => {
        try {
          const res = await fetchViewer();
          setIsSyncing(res.syncing);
          if (!res.syncing) {
            setIsSynced(!res.syncing);
            clearInterval(interval);
          }
        } catch (e) {
          setError(e);
        }
      }, timeout);
    }
    if (!withPolling) {
      setIsSyncing(false);
      setIsSynced(false);
    }
    return () => clearInterval(interval);
  }, [withPolling, timeout, isSynced]);

  return {
    data,
    isError: error,
    isLoading: !data && !error,
    isSyncing,
    isSynced,
  };
};

const useViewerToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('');
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    setIsLoading(true);
    try {
      const res = await axiosWrapper('/api/user/token', { method: 'POST' });
      setData(res);
    } catch (e) {
      console.error(e.message); // eslint-disable-line no-console
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return { data, isLoading, isError: error };
};

const useSyncAccount = (shouldSync) => {
  const [hasSyncReqFiredOff, setHasSyncReqFiredOff] = useState(false);
  const [isError, setIsError] = useState(null);

  const runSyncReq = async () => {
    try {
      await axiosWrapper('/api/user/repos?async=true', { method: 'POST' });
      setHasSyncReqFiredOff(true);
    } catch (e) {
      setIsError(e);
      setHasSyncReqFiredOff(false);
    }
  };

  useEffect(() => {
    if (shouldSync) {
      runSyncReq();
    } else {
      setHasSyncReqFiredOff(false);
    }
  }, [shouldSync, setHasSyncReqFiredOff]);

  return { hasSyncReqFiredOff, isError };
};

export { useViewer, useViewerToken, useSyncAccount };

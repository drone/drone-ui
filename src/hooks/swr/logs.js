import AnsiUp from 'ansi_up';
import {
  useState, useRef, useEffect, useMemo, useCallback,
} from 'react';
import useSWR from 'swr';

import { token, instance } from '_constants';

function escapeLogs(logs) {
  if (!logs) return [];
  const formatter = new AnsiUp();
  formatter.use_classes = true;
  if (Array.isArray(logs)) {
    return logs.map((log) => ({ html: formatter.ansi_to_html(log.out), ...log }));
  }
  return {
    html: formatter.ansi_to_html(logs.out),
    ...logs,
  };
}

// this hooks accepts dispatch fn from reducer
// instead of keeping state internally
const useLogs = (dispatch, actionTypes, {
  namespace, name, build, stage = 1, step = 1,
}, shouldFetchLogs) => {
  const { data, error } = useSWR(shouldFetchLogs ? `/api/repos/${namespace}/${name}/builds/${build}/logs/${stage}/${step}` : null);
  const formattedLogs = useMemo(() => escapeLogs(data), [data]);

  useEffect(() => {
    dispatch({ type: actionTypes.setLogs, payload: formattedLogs });
  }, [dispatch, formattedLogs, actionTypes]);

  useEffect(() => {
    dispatch({ type: actionTypes.setError, payload: error });
    if (data === undefined && !error) {
      dispatch({ type: actionTypes.setIsLoading, payload: true });
    } else {
      dispatch({ type: actionTypes.setIsLoading, payload: false });
    }
  }, [dispatch, data, error, actionTypes]);
};

// same as previous hook, no internal state
const useStreamLogs = (dispatch,
  actionOnUpdateLogs,
  {
    namespace, name, build, stage = 1, step = 1,
  }, shouldStreamLogs) => {
  const [, forceRerender] = useState();
  const stream = useRef();
  const path = useMemo(() => {
    const pathBody = `${namespace}/${name}/${build}/${stage}/${step}`;
    // make path for stream
    if (shouldStreamLogs) {
      return `${instance}/api/stream/${pathBody}${token ? `?access_token=${token}` : ''}`;
    }
    // make path for mutation
    return `/api/repos/${pathBody}`;
  }, [shouldStreamLogs, namespace, name, build, stage, step]);

  const messageHandler = useCallback((event) => {
    const receivedLogs = escapeLogs(JSON.parse(event.data));
    dispatch({ type: actionOnUpdateLogs, payload: receivedLogs });
  }, [dispatch, actionOnUpdateLogs]);

  const errorHandler = useCallback((err, shouldStream) => {
    if (err?.data === 'eof' || !shouldStream) {
      stream.current?.close();
    } else {
      forceRerender();
    }
  }, []);

  useEffect(() => {
    if (shouldStreamLogs) {
      stream.current?.close();
      stream.current = new EventSource(path);
      stream.current.onmessage = messageHandler;
      stream.current.onerror = errorHandler;
    } else {
      errorHandler();
    }
    return () => errorHandler(undefined, false);
  }, [shouldStreamLogs, errorHandler, path, messageHandler]);
};

export { useLogs, useStreamLogs };

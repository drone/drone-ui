import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useEffect, useReducer, useLayoutEffect,
} from 'react';
import { useParams } from 'react-router-dom';

import { LOGS_LIMIT, STATES } from '_constants';
import Console from 'components/shared/console';
import { useDynamicHeight } from 'hooks';
import { useLogs, useStreamLogs } from 'hooks/swr';

import styles from './console-manager.module.scss';
import { ACTION_LIST, logsReducer, logsInitFn } from './console-manager.state';

const cx = classNames.bind(styles);

/* helper components */
export const NonLogsContainer = (props) => {
  const {
    className, children, style,
  } = props;
  return (
    <div
      className={cx('non-logs-container', className)}
      data-container="non-logs"
      style={style}
    >
      {children}
    </div>
  );
};

const useLogsActionTypes = {
  setLogs: ACTION_LIST.SET_LOGS,
  setError: ACTION_LIST.UPDATE_LOGS_HOOK_ERROR,
  setIsLoading: ACTION_LIST.UPDATE_ARE_LOGS_LOADING,
};

const stepDeferredLogsStates = [
  'running',
  'pending',
  'skipped',
  'waiting_on_dependencies',
];

const stageDeferredLogsStates = stepDeferredLogsStates.slice(1);

export default function LogViewConsoleManager(props) {
  const {
    consoleProps, hasBuildDebugMode, isDataLoading, stageStatus, stageName, stepData, buildStatus, stageError,
  } = props;
  const params = useParams();
  /* State */
  const [state, dispatch] = useReducer(logsReducer, props, logsInitFn);
  // derived
  const logsBlobName = `logs_${params.namespace}_${params.name}_${params.build}_${params.stage}_${params.step}`;
  /* Refs */
  const {
    dynamicHeightRef, dynamicHeight,
  } = useDynamicHeight();
  /* Hooks  */
  // logs fetch
  useLogs(
    dispatch,
    useLogsActionTypes,
    params,
    state.compState !== STATES.STREAM_ON
    && !!state.stageStatus
    && !!state.stepData.status
    && !stageDeferredLogsStates.includes(state.stageStatus)
    && !stepDeferredLogsStates.includes(state.stepData.status),
  );

  // logs stream
  useStreamLogs(dispatch,
    ACTION_LIST.UPDATE_LOGS,
    params,
    state.compState === STATES.STREAM_ON);

  /* Effects */

  // @TODO: that is not enough to clean state
  // during build stage/step navigation
  useLayoutEffect(() => {
    dispatch({ type: ACTION_LIST.SET_LOGS, payload: [] });
    return () => {
      dispatch({ type: ACTION_LIST.SET_LOGS, payload: [] });
    };
  }, [params.stage, params.step]);

  useEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_HAS_BUILD_DEBUG_MODE, payload: hasBuildDebugMode });
  }, [hasBuildDebugMode]);

  useLayoutEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_IS_DATA_LOADING, payload: isDataLoading });
  }, [isDataLoading]);

  useEffect(() => {
    if (stageStatus) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_STATUS, payload: stageStatus });
    }
  }, [stageStatus]);

  useEffect(() => {
    if (stageName) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_NAME, payload: stageName });
    }
  }, [stageName]);

  useEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_STEP_DATA, payload: stepData });
  }, [stepData]);

  useEffect(() => {
    if (buildStatus) {
      dispatch({ type: ACTION_LIST.UPDATE_BUILD_STATUS, payload: buildStatus });
    }
  }, [buildStatus]);

  useEffect(() => {
    if (stageError) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_ERROR, payload: stageError });
    }
  }, [stageError]);

  // render state switch statement
  switch (state?.compState) {
    case STATES.IDLE:
      return null;
    case STATES.ERROR:
    case STATES.STREAM_ON:
    case STATES.RESOLVED:
    default:
  }
  return (
    <Console
      ref={dynamicHeightRef}
      height={dynamicHeight}
      shownLogsLimit={LOGS_LIMIT}
      tmateLink={state.tmateLink}
      logs={state.logs}
      showLogsLoadingLine={state.compState === STATES.LOADING
      || (state.compState === STATES.STREAM_ON && !state.logs.length)}
      areLogsLoading={state.compState === STATES.LOADING}
      stepData={state.stepData}
      showDownloadBtn={state.stepData?.stopped && state.compState === STATES.RESOLVED}
      showFollowLogsBtn={state.compState === STATES.STREAM_ON}
      logsBlobName={logsBlobName}
      stageError={stageError}
      stageStatus={stageStatus}
      {...consoleProps}
    />
  );
}

LogViewConsoleManager.propTypes = {
  isDataLoading: PropTypes.bool.isRequired,
  hasBuildDebugMode: PropTypes.bool,
  buildStatus: PropTypes.string,
  stageStatus: PropTypes.string,
  stageName: PropTypes.string,
  stageError: PropTypes.string,
  stepData: PropTypes.shape({
    status: PropTypes.string,
    error: PropTypes.string,
    exit_code: PropTypes.number,
    name: PropTypes.string,
    stopped: PropTypes.number,
  }),
  consoleProps: PropTypes.shape({
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
  }),
};

NonLogsContainer.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.string,
};

LogViewConsoleManager.defaultProps = {
  stepData: {},
  hasBuildDebugMode: false,
  buildStatus: '',
  stageStatus: '',
  stageName: '',
  stageError: undefined,
  consoleProps: {
    showHeader: true,
    showFooter: true,
  },
};

NonLogsContainer.defaultProps = {
  style: undefined,
};

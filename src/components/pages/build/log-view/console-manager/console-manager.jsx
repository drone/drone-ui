import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {
  useEffect, useReducer, useLayoutEffect,
} from 'react';
import { useParams } from 'react-router-dom';

import { LOGS_LIMIT, STATES } from '_constants';
import Console from 'components/shared/console';
import SystemMessage from 'components/shared/system-message';
import { useDynamicHeight } from 'hooks';
import { useLogs, useStreamLogs } from 'hooks/swr';

import styles from './console-manager.module.scss';
import { ACTION_LIST, logsReducer, logsInitFn } from './console-manager.state';
import {
  getIntentFromStepStatus,
  getLogsErrorContent,
  getNoLogsContent,
} from './console-manager.utils';

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

const stepDefferedLogsStates = [
  'running',
  'pending',
  'skipped',
  'waiting_on_dependencies',
];

const stageDefferedLogsStates = stepDefferedLogsStates.slice(1);

export default function LogViewConsoleManager(props) {
  const { consoleProps, ...rest } = props;
  const params = useParams();
  /* State */
  const [state, dispatch] = useReducer(logsReducer, rest, logsInitFn);
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
    state.stageNumber
    && state.stepData?.number
    && (params.step || 1) == state.stepData.number
    && (params.stage || 1) == state.stageNumber
    && state.compState !== STATES.STREAM_ON
    && !!state.stageStatus
    && !!state.stepData.status
    && !stageDefferedLogsStates.includes(state.stageStatus)
    && !stepDefferedLogsStates.includes(state.stepData.status),
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
  }, [params.stage, params.step]);

  useEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_HAS_BUILD_DEBUG_MODE, payload: props.hasBuildDebugMode });
  }, [props.hasBuildDebugMode]);

  useLayoutEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_IS_DATA_LOADING, payload: props.isDataLoading });
  }, [props.isDataLoading]);

  useEffect(() => {
    if (props.stageNumber) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_NUMBER, payload: props.stageNumber });
    }
  }, [props.stageNumber]);

  useEffect(() => {
    if (props.stageStatus) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_STATUS, payload: props.stageStatus });
    }
  }, [props.stageStatus]);

  useEffect(() => {
    if (props.stageName) {
      dispatch({ type: ACTION_LIST.UPDATE_STAGE_NAME, payload: props.stageName });
    }
  }, [props.stageName]);

  useEffect(() => {
    dispatch({ type: ACTION_LIST.UPDATE_STEP_DATA, payload: props.stepData });
  }, [props.stepData]);

  useEffect(() => {
    if (props.buildStatus) {
      dispatch({ type: ACTION_LIST.UPDATE_BUILD_STATUS, payload: props.buildStatus });
    }
  }, [props.buildStatus]);

  // render state switch statement
  switch (state.compState) {
    case STATES.ERROR:
      return (
        <NonLogsContainer style={{ padding: '25px 60px' }}>
          <div className={cx('error-wrapper')}>
            <SystemMessage intent="danger">
              {getLogsErrorContent({
                buildStatus: state.buildStatus,
                stageStatus: state.stageStatus,
                stageName: state.stageName,
                stepName: state.stepData.name,
                stepError: state.stepData.error,
                logsHookError: state.logsHookError,
              })}
            </SystemMessage>
          </div>
        </NonLogsContainer>
      );
    case STATES.NO_LOGS_AVAILABLE:
      return (
        <NonLogsContainer style={{ padding: '25px 60px' }}>
          <SystemMessage intent={getIntentFromStepStatus(state.stepData.status)}>
            {getNoLogsContent({
              buildStatus: state.buildStatus,
              stageStatus: state.stageStatus,
              stageName: state.stageName,
              stepName: state.stepData.name,
              stepStatus: state.stepData.status,
            })}
          </SystemMessage>
        </NonLogsContainer>
      );
    case STATES.IDLE:
      return null;
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
      showHeader={consoleProps.showHeader}
      showFooter={consoleProps.showFooter}
    />
  );
}

LogViewConsoleManager.propTypes = {
  isDataLoading: PropTypes.bool.isRequired,
  hasBuildDebugMode: PropTypes.bool,
  buildStatus: PropTypes.string,
  stageStatus: PropTypes.string,
  stageNumber: PropTypes.number,
  stageName: PropTypes.string,
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

LogViewConsoleManager.defaultProps = {
  stepData: {},
  hasBuildDebugMode: false,
  buildStatus: '',
  stageStatus: '',
  stageName: '',
  stageNumber: 0,
  consoleProps: {
    showHeader: true,
    showFooter: true,
  },
};
